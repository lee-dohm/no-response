import * as core from '@actions/core'
import * as fs from 'fs'
import * as github from '@actions/github'

import Config from './config'
import { GitHub } from '@actions/github/lib/utils'

/* eslint-disable import/no-unresolved */
import { IssueCommentEvent } from '@octokit/webhooks-types'
/* eslint-enable */

const fsp = fs.promises

interface Issue {
  issue_number: number
  owner: string
  repo: string
}

interface LabeledEvent {
  created_at: number
  event: string
  label: {
    name: string
  }
}

interface RestIssue {
  number: number
}

export default class NoResponse {
  config: Config
  octokit: InstanceType<typeof GitHub>

  constructor(config: Config) {
    this.config = config
    this.octokit = github.getOctokit(this.config.token)
  }

  async sweep(): Promise<void> {
    core.debug('Starting sweep')

    await this.ensureLabelExists()

    const issues = await this.getCloseableIssues()
    const promises: Promise<void>[] = issues.map(async (issue) =>
      this.close({ issue_number: issue.number, ...this.config.repo })
    )
    await Promise.all(promises)
  }

  async unmark(): Promise<void> {
    core.debug('Starting unmark')

    const { responseRequiredLabel } = this.config
    const payload: IssueCommentEvent = await this.readPayload()
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const { number } = payload.issue
    const comment = payload.comment
    const issue = { owner, repo, issue_number: number }

    const issueInfo = await this.octokit.rest.issues.get(issue)
    const isMarked = await this.hasResponseRequiredLabel(issue)

    if (isMarked && issueInfo.data.user?.login === comment.user.login) {
      core.info(`${owner}/${repo}#${number} is being unmarked`)

      await this.octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: number,
        name: responseRequiredLabel
      })

      if (
        issueInfo.data.state === 'closed' &&
        issueInfo.data.user.login !== issueInfo.data.closed_by?.login
      ) {
        await this.octokit.rest.issues.update({ owner, repo, issue_number: number, state: 'open' })
      }
    }
  }

  async close(issue: Issue): Promise<void> {
    const { closeComment } = this.config

    core.info(`${issue.owner}/${issue.repo}#${issue.issue_number} is being closed`)

    if (closeComment) {
      await this.octokit.rest.issues.createComment({ body: closeComment, ...issue })
    }

    await this.octokit.rest.issues.update({ state: 'closed', ...issue })
  }

  async ensureLabelExists(): Promise<void> {
    try {
      await this.octokit.rest.issues.getLabel({
        name: this.config.responseRequiredLabel,
        ...this.config.repo
      })
    } catch (e) {
      await this.octokit.rest.issues.createLabel({
        name: this.config.responseRequiredLabel,
        color: this.config.responseRequiredColor,
        ...this.config.repo
      })
    }
  }

  async findLastLabeledEvent(issue: Issue): Promise<LabeledEvent | undefined> {
    const { responseRequiredLabel } = this.config
    const events: LabeledEvent[] = (await this.octokit.paginate(
      this.octokit.rest.issues.listEvents,
      {
        ...issue,
        per_page: 100
      }
    )) as unknown as LabeledEvent[]

    return events
      .reverse()
      .find((event) => event.event === 'labeled' && event.label.name === responseRequiredLabel)
  }

  async getCloseableIssues(): Promise<RestIssue[]> {
    const { owner, repo } = this.config.repo
    const { daysUntilClose, responseRequiredLabel } = this.config
    const q = `repo:${owner}/${repo} is:issue is:open label:"${responseRequiredLabel}"`
    const labeledEarlierThan = this.since(daysUntilClose)

    const issues = await this.octokit.rest.search.issuesAndPullRequests({
      q,
      sort: 'updated',
      order: 'asc',
      per_page: 30
    })

    core.debug(`Issues to check for closing:`)
    core.debug(JSON.stringify(issues, null, 2))

    if (!Array.isArray(issues.data.items)) {
      core.error(`response error: issues.data.items is not a valid array`)
      return []
    }

    const closableIssuesPromises = issues.data.items.map(async (issue) => {
      core.info(`issue: ${JSON.stringify(issue, null, 2)}`)
      const event = await this.findLastLabeledEvent({
        issue_number: issue.number,
        ...this.config.repo
      })
      core.info(`event: ${JSON.stringify(event, null, 2)}`)

      if (!event) {
        return null
      }

      core.debug(`Checking: ${JSON.stringify(issue, null, 2)}`)
      core.debug(`Using: ${JSON.stringify(event, null, 2)}`)

      const creationDate = new Date(event.created_at)

      core.debug(
        `${creationDate.toISOString()} < ${labeledEarlierThan.toISOString()} === ${
          creationDate < labeledEarlierThan
        }`
      )

      if (creationDate < labeledEarlierThan) {
        return issue
      }
      return null
    })

    const allIssues: (RestIssue | null)[] = await Promise.all(closableIssuesPromises)
    const closableIssues = allIssues.filter((val) => val !== null) as RestIssue[]
    core.debug(`Closeable: ${JSON.stringify(closableIssues, null, 2)}`)

    return closableIssues
  }

  async hasResponseRequiredLabel(issue: Issue): Promise<boolean> {
    const labels = await this.octokit.rest.issues.listLabelsOnIssue({ ...issue })

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
