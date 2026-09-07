import type { ProjectId } from '@/config/project.types'
import logoAriMarket from '@/assets/logo/arimarket.png'
import logoExpensIo from '@/assets/logo/expens_io.png'
import logoMashHub from '@/assets/logo/mashhub.png'
import logoPocketPt from '@/assets/logo/pocketpt.png'
import logoRegistrar from '@/assets/logo/registrar.png'
import logoSchedulIo from '@/assets/logo/schedul_io.jpg'

export const PROJECT_LOGO_SRC: Partial<Record<ProjectId, string>> = {
  arimarket: logoAriMarket,
  pocketpt: logoPocketPt,
  mashhub: logoMashHub,
  expens_io: logoExpensIo,
  registrar: logoRegistrar,
  // Same product family/mark as the consumer Expens.io app.
  expens_io_business: logoExpensIo,
  schedul_io: logoSchedulIo,
}

export function projectLogoSrc(id: ProjectId): string | undefined {
  return PROJECT_LOGO_SRC[id]
}
