/**
 * Prints Vite/Router base path for GitHub project pages, e.g. /my-repo/
 * Uses `git remote get-url origin` so it matches https://<user>.github.io/<repo>/
 * Exit 2 = skip (not GitHub or no origin); stdout empty on exit !== 0
 */
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)

let url
try {
  url = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
} catch {
  process.exit(2)
}

url = url.replace(/\.git$/i, '')
if (!/github\.com/i.test(url)) process.exit(2)

let repo = null
const sshStyle = url.match(/^git@[^:]+:(.+)$/i)
if (sshStyle) {
  const parts = sshStyle[1].split('/').filter(Boolean)
  repo = parts.length >= 2 ? parts[parts.length - 1] : null
} else {
  const lower = url.toLowerCase()
  const marker = 'github.com/'
  const idx = lower.indexOf(marker)
  if (idx !== -1) {
    const pathPart = url.slice(idx + marker.length)
    const parts = pathPart.split('/').filter(Boolean)
    if (parts.length >= 2) repo = parts[parts.length - 1]
  }
}

if (!repo) process.exit(2)

if (/^[^/]+\.github\.io$/i.test(repo)) {
  process.stdout.write('/')
} else {
  process.stdout.write(`/${repo}/`)
}
