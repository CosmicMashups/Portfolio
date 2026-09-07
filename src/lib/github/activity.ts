export interface GitHubEventSummary {
  type: string
  repo: string
  createdAt: string
}

const USER = 'CosmicMashups'

export async function fetchPublicEvents(
  limit = 8,
): Promise<GitHubEventSummary[]> {
  const url = `https://api.github.com/users/${USER}/events/public?per_page=${limit}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{
      type: string
      created_at: string
      repo: { name: string }
    }>
    return data.map((e) => ({
      type: e.type,
      repo: e.repo?.name ?? '',
      createdAt: e.created_at,
    }))
  } catch {
    return []
  }
}

export const GITHUB_PROFILE_URL = `https://github.com/${USER}`

/** Platane/snk publishes this file on the `output` branch of the GitHub profile repo (CosmicMashups/CosmicMashups). */
export const GITHUB_PROFILE_SNAKE_SVG_URL = `https://raw.githubusercontent.com/${USER}/${USER}/output/github-contribution-grid-snake.svg`
