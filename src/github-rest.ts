import * as github from '@actions/github'

import { GitHub as Octokit } from '@actions/github/lib/utils'
import { RequestInterface } from '@octokit/types'

import {
  CreateIssueCommentParams,
  CreateLabelParams,
  GetIssueResponse,
  GetLabelParams,
  GitHub,
  Issue,
  ListIssueEventsData,
  ListLabelsOnIssueResponse,
  RemoveIssueLabelParams,
  SearchIssuesAndPullRequestsParams,
  SearchIssuesAndPullRequestsResponse
} from './github'

export default class GitHubRest implements GitHub {
  octokit: InstanceType<typeof Octokit>

  constructor(token: string) {
    this.octokit = github.getOctokit(token)
  }

  async closeIssue(params: Issue): Promise<void> {
    this.octokit.issues.update({ state: 'closed', ...params })
  }

  async createIssueComment(params: CreateIssueCommentParams): Promise<void> {
    this.octokit.issues.createComment({ ...params })
  }

  async createLabel(params: CreateLabelParams): Promise<void> {
    this.octokit.issues.createLabel({ ...params })
  }

  async getIssue(params: Issue): Promise<GetIssueResponse> {
    return this.octokit.issues.get({ ...params })
  }

  async getLabel(params: GetLabelParams): Promise<void> {
    this.octokit.issues.getLabel({ ...params })
  }

  async listIssueEvents(params: Issue): Promise<ListIssueEventsData> {
    return this.octokit.paginate(
      ((await this.octokit.issues.listEvents({
        ...params,
        per_page: 100
      })) as unknown) as RequestInterface<object>
    )
  }

  async listLabelsOnIssue(params: Issue): Promise<ListLabelsOnIssueResponse> {
    return this.octokit.issues.listLabelsOnIssue({ ...params })
  }

  async removeIssueLabel(params: RemoveIssueLabelParams): Promise<void> {
    this.octokit.issues.removeLabel({ ...params })
  }

  async reopenIssue(params: Issue): Promise<void> {
    this.octokit.issues.update({ state: 'open', ...params })
  }

  async searchIssuesAndPullRequests(
    params: SearchIssuesAndPullRequestsParams
  ): Promise<SearchIssuesAndPullRequestsResponse> {
    return this.octokit.search.issuesAndPullRequests({ ...params })
  }
}
