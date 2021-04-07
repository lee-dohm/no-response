import * as core from '@actions/core'
import { promises as fsp } from 'fs'
import * as scramjet from 'scramjet'

import { IssueCommentEvent } from '@octokit/webhooks-definitions/schema'

import Config from './config'
import { GitHub, Issue } from './github'
import GitHubRest from './github-rest'

interface LabeledEvent {
  created_at: string
  event: string
  label?: {
    name: string
  }
}

interface IssueNumber {
  number: number
}

export default class NoResponse {
  config: Config
  github: GitHub

  constructor(config: Config) {
    this.config = config
    this.github = new GitHubRest(this.config.token)
  }

  async sweep(): Promise<void> {
    core.debug('Starting sweep')

    await this.ensureLabelExists()

    const issues = await this.getCloseableIssues()

    for (const issue of issues) {
      this.close({ issue_number: issue.number, ...this.config.repo })
    }
  }

  async unmark(): Promise<void> {
    core.debug('Starting unmark')

    const { responseRequiredLabel } = this.config
    const payload: IssueCommentEvent = await this.readPayload()
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const { number: issue_number } = payload.issue
    const comment = payload.comment
    const issue = { owner, repo, issue_number }

    const issueInfo = await this.github.getIssue(issue)
    const isMarked = await this.hasResponseRequiredLabel(issue)

    if (isMarked && issueInfo.data.user?.login === comment.user.login) {
      core.info(`${owner}/${repo}#${issue_number} is being unmarked`)

      await this.github.removeIssueLabel({
        owner,
        repo,
        issue_number,
        name: responseRequiredLabel
      })

      if (
        issueInfo.data.state === 'closed' &&
        issueInfo.data.user.login !== issueInfo.data.closed_by?.login
      ) {
        this.github.reopenIssue({ owner, repo, issue_number })
      }
    }
  }

  async close(issue: Issue): Promise<void> {
    const { closeComment } = this.config

    core.info(`${issue.owner}/${issue.repo}#${issue.issue_number} is being closed`)

    if (closeComment) {
      await this.github.createIssueComment({ body: closeComment, ...issue })
    }

    await this.github.closeIssue({ ...issue })
  }

  async ensureLabelExists(): Promise<void> {
    try {
      await this.github.getLabel({
        name: this.config.responseRequiredLabel,
        ...this.config.repo
      })
    } catch (e) {
      await this.github.createLabel({
        name: this.config.responseRequiredLabel,
        color: this.config.responseRequiredColor,
        ...this.config.repo
      })
    }
  }

  async findLastLabeledEvent(issue: Issue): Promise<LabeledEvent | undefined> {
    const { responseRequiredLabel } = this.config
    const events: LabeledEvent[] = await this.github.listIssueEvents({ ...issue })

    return events
      .reverse()
      .find((event) => event.event === 'labeled' && event.label?.name === responseRequiredLabel)
  }

  async getCloseableIssues(): Promise<IssueNumber[]> {
    const { owner, repo } = this.config.repo
    const { daysUntilClose, responseRequiredLabel } = this.config
    const q = `repo:${owner}/${repo} is:issue is:open label:"${responseRequiredLabel}"`
    const labeledEarlierThan = this.since(daysUntilClose)

    const issues = await this.github.searchIssuesAndPullRequests({
      q,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    })

    core.debug(`Issues to check for closing:`)
    core.debug(JSON.stringify(issues, null, 2))

    const closableIssues = await scramjet
      .fromArray(issues.data.items)
      .filter(async (issue) => {
        const event = await this.findLastLabeledEvent({
          issue_number: issue.number,
          ...this.config.repo
        })

        if (!event) {
          return false
        }

        core.debug(`Checking: ${JSON.stringify(issue, null, 2)}`)
        core.debug(`Using: ${JSON.stringify(event, null, 2)}`)

        const labeledDate = new Date(event.created_at)

        core.debug(
          `${labeledDate.toISOString()} < ${labeledEarlierThan.toISOString()} === ${
            labeledDate < labeledEarlierThan
          }`
        )

        return labeledDate < labeledEarlierThan
      })
      .toArray()

    core.debug(`Closeable: ${JSON.stringify(closableIssues, null, 2)}`)

    return closableIssues
  }

  async hasResponseRequiredLabel(issue: Issue): Promise<boolean> {
    const labels = await this.github.listLabelsOnIssue({ ...issue })

    return labels.data.map((label) => label.name).includes(this.config.responseRequiredLabel)
  }

  async readPayload(): Promise<IssueCommentEvent> {
    if (!process.env.GITHUB_EVENT_PATH) {
      throw new Error('GITHUB_EVENT_PATH is not defined')
    }

    const text = (await fsp.readFile(process.env.GITHUB_EVENT_PATH)).toString()

    return JSON.parse(text)
  }

  since(days: number): Date {
    const ttl = days * 24 * 60 * 60 * 1000

    return new Date(new Date().getTime() - ttl)
  }
}
