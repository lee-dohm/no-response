import Config from '../src/config'
import NoResponse from '../src/no-response'

describe('NoResponse', () => {
  let config: Config

  beforeEach(() => {
    process.env['GITHUB_REPOSITORY'] = 'test-owner/test-repo'
    process.env['INPUT_TOKEN'] = '1234567890abcdef'

    config = new Config()
  })

  describe('ensureLabelExists', () => {
    it('does not create the label if it already exists', async () => {
      const noResponse = new NoResponse(config)

      noResponse.ensureLabelExists()
    })
  })
})
