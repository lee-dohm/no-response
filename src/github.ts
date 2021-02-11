import { promises as fsp } from 'fs'
import path from 'path'

import * as github from '@actions/github'

import { GitHub as OctokitInstance } from '@actions/github/lib/utils'

import Config from './config'
import { Label } from './interfaces'

export type GraphQlResults = Record<string, any>
type GraphqlVariables = Record<string, any>
type Octokit = InstanceType<typeof OctokitInstance>

interface MutationCreateLabelData {
  createLabel: {
    label: {
      name: string
    }
  }
}

interface QueryMatchingLabelsData {
  repository: {
    id: string
    labels: {
      nodes: Label[]
    }
  }
}

async function executeGraphql<T>(
  octokit: Octokit,
  filename: string,
  variables: GraphqlVariables
): Promise<T> {
  const graphql = await graphqlText(filename)

  return (await octokit.graphql(graphql, variables)) as T
}

async function graphqlText(filename: string): Promise<string> {
  const filepath = path.join(__dirname, 'graphql', `${filename}.graphql`)
  const text = await fsp.readFile(filepath, { encoding: 'utf8' }).toString()

  return text
}

export default class GitHub {
  config: Config
  octokit: Octokit

  constructor(config: Config) {
    this.config = config
    this.octokit = github.getOctokit(this.config.token, {
      userAgent: 'lee-dohm/no-response',
      accept: 'application/vnd.github.bane-preview+json'
    })
  }

  async ensureLabelExists(label: Label): Promise<void> {
    const queryResults = await executeGraphql<QueryMatchingLabelsData>(
      this.octokit,
      'query-matching-labels',
      {
        ...this.config.repo,
        q: label.name
      }
    )

    const exists = queryResults.repository.labels.nodes
      .map((l: Label) => {
        return l.name
      })
      .includes(label.name)

    if (!exists) {
      const repoId = queryResults.repository.id

      const mutationResults = await executeGraphql<MutationCreateLabelData>(
        this.octokit,
        'mutation-create-label',
        {
          ...label,
          repositoryId: repoId
        }
      )

      if (mutationResults.createLabel.label.name !== label.name) {
        throw new Error(`Could not create label: ${label.name}`)
      }
    }
  }
}
