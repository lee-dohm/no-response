import { getConfigFileParsingDiagnostics } from 'typescript'
import Config from '../src/config'
import GitHubRest from '../src/github-rest'
import NoResponse from '../src/no-response'

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

      noResponse.ensureLabelExists()

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
})
