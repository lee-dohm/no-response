import * as github from '@actions/github'

import { GitHub as GitHubType } from '@actions/github/lib/utils'
import {
  GetResponseTypeFromEndpointMethod,
  GetResponseDataTypeFromEndpointMethod,
  RequestInterface
} from '@octokit/types'

import { Octokit } from '@octokit/rest'

const octokit = new Octokit()

type CreateIssueCommentParams = { body: string } & Issue
type CreateLabelParams = { color: string; name: string } & Repo
type GetIssueResponse = GetResponseTypeFromEndpointMethod<typeof octokit.issues.get>
type GetLabelParams = { name: string } & Repo
type Issue = { issue_number: number } & Repo

type ListIssueEventsData = GetResponseDataTypeFromEndpointMethod<typeof octokit.issues.listEvents>

type ListLabelsOnIssueResponse = GetResponseTypeFromEndpointMethod<
  typeof octokit.issues.listLabelsOnIssue
>

type RemoveIssueLabelParams = { name: string } & Issue

type SearchIssuesAndPullRequestsResponse = GetResponseTypeFromEndpointMethod<
  typeof octokit.search.issuesAndPullRequests
>

interface Repo {
  owner: string
  repo: string
}

interface SearchIssuesAndPullRequestsParams {
  order?: 'desc' | 'asc'
  per_page: number
  q: string
  sort?:
    | 'comments'
    | 'reactions'
    | 'reactions-+1'
    | 'reactions--1'
    | 'reactions-smile'
    | 'reactions-thinking_face'
    | 'reactions-heart'
    | 'reactions-tada'
    | 'interactions'
    | 'created'
    | 'updated'
    | undefined
}

export default class GitHub {
  octokit: InstanceType<typeof GitHubType>

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
