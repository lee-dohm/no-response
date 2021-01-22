import { promises as fsp } from 'fs'
import path from 'path'

export function text(filename: string): string {
  const filepath = path.join(__dirname, 'graphql', `${filename}.graphql`)
  const text = fsp.readFile(filepath, { encoding: 'utf8' }).toString()

  return text
}
