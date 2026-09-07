import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/shell/AppShell'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const ProjectPage = lazy(() => import('@/pages/ProjectPage').then((m) => ({ default: m.ProjectPage })))
const ThoughtsPage = lazy(() => import('@/pages/ThoughtsPage').then((m) => ({ default: m.ThoughtsPage })))
const ThoughtPostPage = lazy(() => import('@/pages/ThoughtPostPage').then((m) => ({ default: m.ThoughtPostPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

const baseUrl = import.meta.env.BASE_URL
const routerBasename =
  baseUrl === '/' ? undefined : baseUrl.replace(/\/$/, '')

function RouteFallback() {
  return <div className="py-12 text-center text-sm text-[var(--global-text-muted)]">Loading page…</div>
}

const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><HomePage /></Suspense> },
      { path: 'projects/:slug', element: <Suspense fallback={<RouteFallback />}><ProjectPage /></Suspense> },
      { path: 'thoughts', element: <Suspense fallback={<RouteFallback />}><ThoughtsPage /></Suspense> },
      { path: 'thoughts/:slug', element: <Suspense fallback={<RouteFallback />}><ThoughtPostPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense> },
    ],
  },
  ],
  routerBasename ? { basename: routerBasename } : {},
)

export const AppRouter = () => <RouterProvider router={router} future={{ v7_startTransition: true }} />
