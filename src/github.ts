import {
  GetResponseTypeFromEndpointMethod,
  GetResponseDataTypeFromEndpointMethod
} from '@octokit/types'

import { Octokit } from '@octokit/rest'

const octokit = new Octokit()

export type CreateIssueCommentParams = { body: string } & Issue
export type CreateLabelParams = { color: string; name: string } & Repo
export type GetIssueResponse = GetResponseTypeFromEndpointMethod<typeof octokit.issues.get>
export type GetLabelParams = { name: string } & Repo
export type Issue = { issue_number: number } & Repo

export type ListIssueEventsData = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.issues.listEvents
>

export type ListLabelsOnIssueResponse = GetResponseTypeFromEndpointMethod<
  typeof octokit.issues.listLabelsOnIssue
>

export type RemoveIssueLabelParams = { name: string } & Issue

export type SearchIssuesAndPullRequestsResponse = GetResponseTypeFromEndpointMethod<
  typeof octokit.search.issuesAndPullRequests
>

export interface Repo {
  owner: string
  repo: string
}

export interface SearchIssuesAndPullRequestsParams {
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

export abstract class GitHub {
  abstract closeIssue(params: Issue): Promise<void>
  abstract createIssueComment(params: CreateIssueCommentParams): Promise<void>
  abstract createLabel(params: CreateLabelParams): Promise<void>
  abstract getIssue(params: Issue): Promise<GetIssueResponse>
  abstract getLabel(params: GetLabelParams): Promise<void>
  abstract listIssueEvents(params: Issue): Promise<ListIssueEventsData>
  abstract listLabelsOnIssue(params: Issue): Promise<ListLabelsOnIssueResponse>
  abstract removeIssueLabel(params: RemoveIssueLabelParams): Promise<void>
  abstract reopenIssue(params: Issue): Promise<void>
  abstract searchIssuesAndPullRequests(
    params: SearchIssuesAndPullRequestsParams
  ): Promise<SearchIssuesAndPullRequestsResponse>
}
