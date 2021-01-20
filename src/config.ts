import * as core from '@actions/core'
import * as github from '@actions/github'

const defaultCloseComment = `
This issue has been automatically closed because there has been no response
to our request for more information from the original author. With only the
information that is currently in the issue, we don't have enough information
to take action. Please reach out if you have or find the answers we need so
that we can investigate further.
`

interface Repo {
  owner: string
  repo: string
}

export default class Config {
  closeComment: string | undefined
  daysUntilClose: number
  repo: Repo
  responseRequiredColor: string
  responseRequiredLabel: string
  token: string

  constructor() {
    this.closeComment =
      core.getInput('closeComment') !== ''
        ? core.getInput('closeComment')
        : defaultCloseComment

    if (this.closeComment === 'false') {
      this.closeComment = undefined
    }

    this.daysUntilClose = parseInt(
      core.getInput('daysUntilClose') !== ''
        ? core.getInput('daysUntilClose')
        : '14'
    )

    this.repo = github.context.repo

    this.responseRequiredColor =
      core.getInput('responseRequiredColor') !== ''
        ? core.getInput('responseRequiredColor')
        : 'ffffff'

    this.responseRequiredLabel =
      core.getInput('responseRequiredLabel') !== ''
        ? core.getInput('responseRequiredLabel')
        : 'more-information-needed'

    this.token = core.getInput('token', {required: true})
  }
}
