import type { ProjectId } from '@/config/project.types'
import mashHubResearch from '@/assets/research/MashHub.pdf'
import ariMarketResearch from '@/assets/research/ARIMArket.pdf'
import pocketPtResearch from '@/assets/research/PocketPT.pdf'

/** Vite-resolved URLs for manuscript PDFs bundled with the app. */
const BY_PROJECT_ID: Partial<Record<ProjectId, string>> = {
  mashhub: mashHubResearch,
  arimarket: ariMarketResearch,
  pocketpt: pocketPtResearch,
}

export function researchPaperUrl(id: ProjectId): string | undefined {
  return BY_PROJECT_ID[id]
}
