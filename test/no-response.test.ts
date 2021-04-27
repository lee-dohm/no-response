import Config from '../src/config'
import { Issue, ListIssueEventsData } from '../src/github'
import GitHubRest from '../src/github-rest'
import { LabeledEvent, NoResponse } from '../src/no-response'

jest.mock('../src/github-rest')

const GitHubMock = GitHubRest as jest.MockedClass<typeof GitHubRest>

describe('NoResponse', () => {
  let config: Config
  let mockGitHub: GitHubRest
  let noResponse: NoResponse

  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = 'test-owner/test-repo'
    process.env.INPUT_TOKEN = '1234567890abcdef'

    config = new Config()
    noResponse = new NoResponse(config)
    mockGitHub = GitHubMock.mock.instances[0]
  })

  describe('ensureLabelExists', () => {
    it('does not attempt to create the label if it already exists', async () => {
      noResponse.ensureLabelExists()

      expect(mockGitHub.getLabel).toHaveBeenCalledTimes(1)
      expect(mockGitHub.getLabel).toHaveBeenCalledWith({
        name: config.responseRequiredLabel,
        ...config.repo
      })

      expect(mockGitHub.createLabel).not.toHaveBeenCalled()
    })

    it('creates the label if it does not exist', async () => {
      mockGitHub.getLabel = jest.fn(() => {
        throw new Error('getLabel fails')
      })

      await noResponse.ensureLabelExists()

      expect(mockGitHub.getLabel).toHaveBeenCalledTimes(1)
      expect(mockGitHub.getLabel).toHaveBeenCalledWith({
        name: config.responseRequiredLabel,
        ...config.repo
      })

      expect(mockGitHub.createLabel).toHaveBeenCalledTimes(1)
      expect(mockGitHub.createLabel).toHaveBeenCalledWith({
        name: config.responseRequiredLabel,
        color: config.responseRequiredColor,
        ...config.repo
      })
    })
  })

  describe('findLastLabeledEvent', () => {
    let matchingEvent: LabeledEvent
    let testIssue: Issue

    beforeEach(() => {
      matchingEvent = {
        created_at: '5',
        event: 'labeled',
        label: {
          name: config.responseRequiredLabel
        }
      }

      testIssue = {
        issue_number: 123,
        owner: 'test-owner',
        repo: 'test-repo'
      }
    })

    it('returns undefined if no events are returned', async () => {
      mockGitHub.listIssueEvents = jest.fn(async () => {
        return []
      })

      const event = await noResponse.findLastLabeledEvent(testIssue)

      expect(mockGitHub.listIssueEvents).toHaveBeenCalledTimes(1)
      expect(mockGitHub.listIssueEvents).toHaveBeenCalledWith({...testIssue})

      expect(event).toBeUndefined()
    })

    it('returns the only matching event if one exists', async () => {
      mockGitHub.listIssueEvents = jest.fn(async () => {
        return [ matchingEvent ] as unknown as ListIssueEventsData
      })

      const event = await noResponse.findLastLabeledEvent(testIssue)

      expect(mockGitHub.listIssueEvents).toHaveBeenCalledTimes(1)
      expect(mockGitHub.listIssueEvents).toHaveBeenCalledWith({...testIssue})

      expect(event).toEqual(matchingEvent)
    })
  })
})
