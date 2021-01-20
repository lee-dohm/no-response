import nock from 'nock'

import Config from '../src/config'
import NoResponse from '../src/no-response'

describe('NoResponse', () => {
  let config: Config
  let n: nock.Scope

  beforeEach(() => {
    config = {
      closeComment: 'Close comment test',
      daysUntilClose: 365,
      repo: {
        owner: 'test-owner',
        repo: 'test-repo'
      },
      responseRequiredLabel: 'test-label',
      responseRequiredColor: 'c0ffee',
      token: '1234567890abcdef'
    }

    n = nock('https://api.github.com')
  })

  describe('ensureLabelExists', () => {
    it('creates a label if one does not exist', async () => {
      n.get('/repos/test-owner/test-repo/labels/test-label').reply(404, {})
      n.post('/repos/test-owner/test-repo/labels', {
        name: 'test-label',
        color: 'c0ffee'
      }).reply(200)

      const noResponse = new NoResponse(config)

      await noResponse.ensureLabelExists()

      expect(n.isDone()).toBeTruthy()
    })

    it('does not create the label if it already exists', async () => {
      n.get('/repos/test-owner/test-repo/labels/test-label').reply(200)

      const noResponse = new NoResponse(config)

      await noResponse.ensureLabelExists()

      expect(n.isDone()).toBeTruthy()
    })
  })
})
