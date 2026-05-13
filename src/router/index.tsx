import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/shell/AppShell'
import { HomePage } from '@/pages/HomePage'
import { ProjectPage } from '@/pages/ProjectPage'
import { ThoughtsPage } from '@/pages/ThoughtsPage'
import { ThoughtPostPage } from '@/pages/ThoughtPostPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects/:slug', element: <ProjectPage /> },
      { path: 'thoughts', element: <ThoughtsPage /> },
      { path: 'thoughts/:slug', element: <ThoughtPostPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} future={{ v7_startTransition: true }} />
