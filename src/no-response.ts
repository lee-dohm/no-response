import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'
import * as scramjet from 'scramjet'

import { GitHub } from '@actions/github/lib/utils'

import Config from './config'

interface Issue {
  issue_number: number
  owner: string
  repo: string
}

export default class NoResponse {
  config: Config
  octokit: InstanceType<typeof GitHub>

  constructor(config: Config) {
    this.config = config
    this.octokit = github.getOctokit(this.config.token)
  }

  async sweep() {
    core.debug('Starting sweep')

    await this.ensureLabelExists()

    const issues = await this.getCloseableIssues()
    issues.forEach((issue) => this.close(issue))
  }

  async unmark() {
    core.debug('Starting unmark')

    const { responseRequiredLabel } = this.config
    const payload: Webhooks.EventPayloads.WebhookPayloadIssueComment = this.octokit.context.payload
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const { number } = payload.issue
    const comment = payload.comment
    const issue = { owner, repo, issue_number: number }

    const issueInfo = await this.octokit.issues.get(issue)
    const isMarked = await this.hasResponseRequiredLabel(issue)

    if (isMarked && issueInfo.data.user?.login === comment.user.login) {
      core.info(`${owner}/${repo}#${number} is being unmarked`)

      await this.octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: number,
        name: responseRequiredLabel
      })

      if (
        issueInfo.data.state === 'closed' &&
        issueInfo.data.user.login !== issueInfo.data.closed_by?.login
      ) {
        this.octokit.issues.update({ owner, repo, issue_number: number, state: 'open' })
      }
    }
  }

  async close(issue: Issue) {
    const { closeComment } = this.config

    core.info(`${issue.owner}/${issue.repo}#${issue.issue_number} is being closed`)

    if (closeComment) {
      await this.octokit.issues.createComment({ body: closeComment, ...issue })
    }

    return this.octokit.issues.update({ state: 'closed', ...issue })
  }

  async ensureLabelExists() {
    return this.octokit.issues
      .getLabel({ name: this.config.responseRequiredLabel, ...this.config.repo })
      .catch(() => {
        this.octokit.issues.createLabel({
          name: this.config.responseRequiredLabel,
          color: this.config.responseRequiredColor,
          ...this.config.repo
        })
      })
  }

  async findLastLabeledEvent(owner: string, repo: string, number: number) {
    const { responseRequiredLabel } = this.config
    const events = await this.octokit.paginate(
      this.octokit.issues.listEvents({
        owner,
        repo,
        issue_number: number,
        per_page: 100
      }) as any
    )

    return events[0].data
      .reverse()
      .find((event: any) => event.event === 'labeled' && event.label.name === responseRequiredLabel)
  }

  async getCloseableIssues(): Promise<Issue[]> {
    const { owner, repo } = this.config.repo
    const { daysUntilClose, responseRequiredLabel } = this.config
    const q = `repo:${owner}/${repo} is:issue is:open label:"${responseRequiredLabel}"`
    const labeledEarlierThan = this.since(daysUntilClose)

    const issues = await this.octokit.search.issuesAndPullRequests({
      q,
      sort: 'updated',
      order: 'desc',
      per_page: 30
    })

    const closableIssues = scramjet
      .fromArray(issues.data.items)
      .filter(async (issue) => {
        const event = await this.findLastLabeledEvent(owner, repo, issue.number)
        const creationDate = new Date(event.created_at)

        return creationDate < labeledEarlierThan
      })
      .toArray()

    return closableIssues
  }

  async hasResponseRequiredLabel(issue: Issue): Promise<boolean> {
    const labels = await this.octokit.issues.listLabelsOnIssue({ ...issue })

    return labels.data.map((label) => label.name).includes(this.config.responseRequiredLabel)
  }

  since(days: number): Date {
    const ttl = days * 24 * 60 * 60 * 1000

    return new Date(new Date().getTime() - ttl)
  }
}
