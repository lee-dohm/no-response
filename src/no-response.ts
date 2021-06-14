import * as core from '@actions/core'
import * as fs from 'fs'
import * as github from '@actions/github'
import * as scramjet from 'scramjet'

import { GitHub } from '@actions/github/lib/utils'
import { IssueCommentEvent } from '@octokit/webhooks-types'
import { RequestInterface } from '@octokit/types'

import Config from './config'

const fsp = fs.promises

interface Comment {
  created_at: number
  user: RestUser
}

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
  closed_by?: RestUser | null
  number: number
  user: RestUser
  state: string
}

interface RestUser {
  login: string
}

export default class NoResponse {
  config: Config
  octokit: InstanceType<typeof GitHub>

  constructor(config: Config) {
    this.config = config
    this.octokit = github.getOctokit(this.config.token)
  }

  async checkForCloseableIssues(): Promise<void> {
    core.debug('Starting check for closeable issues')

    await this.ensureLabelExists()

    const issues = await this.getCloseableIssues()

    for (const issue of issues) {
      this.close({ issue_number: issue.number, ...this.config.repo })
    }
  }

  async checkForClearableState(): Promise<void> {
    core.debug('Starting check for clearable state')

    const payload: IssueCommentEvent = await this.readPayload()
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const { number } = payload.issue
    const comment = payload.comment
    const issue = { owner, repo, issue_number: number }

    const issueInfo = await this.octokit.issues.get(issue)
    const isMarked = await this.hasResponseRequiredLabel(issue)

    if (isMarked && issueInfo.data.user?.login === comment.user.login) {
      await this.clearNoResponseState(issueInfo.data as RestIssue)
    }
  }

  async close(issue: Issue): Promise<void> {
    const { closeComment } = this.config

    core.info(`${issue.owner}/${issue.repo}#${issue.issue_number} is being closed`)

    if (closeComment) {
      await this.octokit.issues.createComment({ body: closeComment, ...issue })
    }

    await this.octokit.issues.update({ state: 'closed', ...issue })
  }

  async clearNoResponseState(issue: RestIssue): Promise<void> {
    const { owner, repo } = this.config.repo

    core.info(`${owner}/${repo}#${issue.number} is being cleared of no response state`)

    await this.octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: issue.number,
      name: this.config.responseRequiredLabel
    })

    if (issue.state === 'closed' && issue.user.login !== issue.closed_by?.login) {
      await this.octokit.issues.update({ owner, repo, issue_number: issue.number, state: 'open' })
    }
  }

  async ensureLabelExists(): Promise<void> {
    try {
      await this.octokit.issues.getLabel({
        name: this.config.responseRequiredLabel,
        ...this.config.repo
      })
    } catch (e) {
      this.octokit.issues.createLabel({
        name: this.config.responseRequiredLabel,
        color: this.config.responseRequiredColor,
        ...this.config.repo
      })
    }
  }

  async findLastAuthorComment(issue: Issue, login: string): Promise<Comment | undefined> {
    const comments: Comment[] = await this.octokit.paginate(
      ((await this.octokit.issues.listComments({
        ...issue,
        per_page: 100
      })) as unknown) as RequestInterface<object>
    )

    const authorComments = await scramjet
      .fromArray(comments)
      .filter(async (comment) => {
        return comment.user.login === login
      })
      .toArray()

    if (authorComments.length === 0) {
      return undefined
    } else {
      return authorComments.pop()
    }
  }

  async findLastLabeledEvent(issue: Issue): Promise<LabeledEvent | undefined> {
    const { responseRequiredLabel } = this.config
    const events: LabeledEvent[] = await this.octokit.paginate(
      ((await this.octokit.issues.listEvents({
        ...issue,
        per_page: 100
      })) as unknown) as RequestInterface<object>
    )

    return events
      .reverse()
      .find((event) => event.event === 'labeled' && event.label.name === responseRequiredLabel)
  }

  async getCloseableIssues(): Promise<RestIssue[]> {
    const { daysUntilClose } = this.config

    const issues = await this.getLabeledIssues()

    core.debug(`Issues to check for closing:`)
    core.debug(JSON.stringify(issues, null, 2))

    const labeledEarlierThan = this.since(daysUntilClose)

    const closableIssues = await scramjet
      .fromArray(issues)
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

        const creationDate = new Date(event.created_at)

        core.debug(
          `${creationDate.toISOString()} < ${labeledEarlierThan.toISOString()} === ${
            creationDate < labeledEarlierThan
          }`
        )

        return creationDate < labeledEarlierThan
      })
      .toArray()

    core.debug(`Closeable: ${JSON.stringify(closableIssues, null, 2)}`)

    return closableIssues
  }

  async getLabeledIssues(): Promise<RestIssue[]> {
    const { owner, repo } = this.config.repo
    const { responseRequiredLabel } = this.config
    const q = `repo:${owner}/${repo} is:issue is:open label:"${responseRequiredLabel}"`

    const response = this.octokit.search.issuesAndPullRequests({
      q,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    })

    return (await response).data.items
  }

  async hasResponseRequiredLabel(issue: Issue): Promise<boolean> {
    const labels = await this.octokit.issues.listLabelsOnIssue({ ...issue })

    return labels.data.map((label) => label.name).includes(this.config.responseRequiredLabel)
  }

  async lastChanceCheck(): Promise<void> {
    core.debug('Starting last chance check')

    await this.ensureLabelExists()

    const issues = await this.getLabeledIssues()

    for (const issue of issues) {
      const event = await this.findLastLabeledEvent({
        issue_number: issue.number,
        ...this.config.repo
      })

      if (!event) {
        throw new Error(
          `No labeled event found on issue that has the label: ${this.toShortIssueName(issue)}`
        )
      }

      const comment = await this.findLastAuthorComment(
        { issue_number: issue.number, ...this.config.repo },
        issue.user.login
      )

      if (comment && comment.created_at > event.created_at) {
        await this.clearNoResponseState(issue)
      }
    }
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

  toShortIssueName(issue: RestIssue): string {
    return `${this.config.repo.owner}/${this.config.repo.repo}#${issue.number}`
  }
}
