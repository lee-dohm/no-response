import nock from 'nock'

import Config from '../src/config'
import GitHub from '../src/github'

let requestBodies: nock.Body[] = []

interface GraphQlResults {
  data: Record<string, any>
}

function graphqlNock(...returnValues: GraphQlResults[]): void {
  const n = nock('https://api.github.com')

  returnValues.forEach((returnValue) => {
    n.post('/graphql').reply(200, (_, body) => {
      requestBodies.push(body)

      return returnValue
    })
  })
}

describe('GitHub', () => {
  let config: Config

  beforeEach(() => {
    process.env['GITHUB_REPOSITORY'] = 'test-owner/test-repo'
    process.env['INPUT_TOKEN'] = '1234567890abcdef'

    config = new Config()
  })

  describe('ensureLabelExists', () => {
    it('does not create the label if it already exists', async () => {
      graphqlNock({
        data: {
          repository: {
            labels: {
              nodes: [
                {
                  name: 'test-label'
                }
              ]
            }
          }
        }
      })

      const github = new GitHub(config)

      await github.ensureLabelExists({ name: 'test-label' })

      expect(requestBodies.length).toBe(1)
    })

    it('creates the label if it does not exist', async () => {
      graphqlNock(
        {
          data: {
            repository: {
              labels: {
                nodes: [
                  {
                    name: 'test-label'
                  }
                ]
              }
            }
          }
        },
        {
          data: {
            createLabel: {
              label: {
                name: 'test-label'
              }
            }
          }
        }
      )

      const github = new GitHub(config)

      await github.ensureLabelExists({ name: 'test-label' })

      expect(requestBodies.length).toBe(2)
    })
  })
})
