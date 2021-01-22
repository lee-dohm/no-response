import nock from 'nock'

import Config from '../src/config'
import NoResponse from '../src/no-response'

import { Issue } from '../src/no-response'

function issueSplit(shortname: string): Issue {
  const match = shortname.match(/([^/]+)\/([^#]+)#([0-9]+)/)

  if (!match) {
    throw new Error(`${shortname} does not match issue link pattern`)
  }

  return {
    issue_number: Number.parseInt(match[3]),
    owner: match[1],
    repo: match[2]
  }
}

describe('NoResponse', () => {
  let config: Config
  let n: nock.Scope

  beforeEach(() => {
    process.env['GITHUB_REPOSITORY'] = 'test-owner/test-repo'
    process.env['INPUT_TOKEN'] = '1234567890abcdef'

    config = Object.assign(new Config(), {
      closeComment: 'Close comment test',
      daysUntilClose: 365,
      repo: {
        owner: 'test-owner',
        repo: 'test-repo'
      },
      responseRequiredLabel: 'test-label',
      responseRequiredColor: 'c0ffee',
      token: '1234567890abcdef'
    })

    n = nock('https://api.github.com')
  })

  describe('getCloseableIssues', () => {
    it('returns an empty array if there are no open issues', async () => {
      n.get('/search/issues')
        .query({
          q: 'repo:test-owner/test-repo is:issue is:open label:"test-label"',
          sort: 'updated',
          order: 'desc',
          per_page: 30
        })
        .reply(200, { items: [] })

      const noResponse = new NoResponse(config)

      const issues = await noResponse.getCloseableIssues()

      expect(n.isDone()).toBeTruthy()
      expect(issues).toStrictEqual([])
    })
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
