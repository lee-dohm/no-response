import * as core from '@actions/core'

import Config from './config'
import NoResponse from './no-response'

async function run(): Promise<void> {
  try {
    const eventName = process.env['GITHUB_EVENT_NAME']

    const config = new Config()
    const noResponse = new NoResponse(config)

    if (eventName === 'schedule') {
      noResponse.checkForCloseableIssues()
    } else if (eventName === 'issue_comment') {
      noResponse.checkForClearableState()
    } else {
      core.error(`Unrecognized event: ${eventName}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
