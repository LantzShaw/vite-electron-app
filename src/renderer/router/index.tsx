import { createHashRouter, RouteObject } from 'react-router-dom'

import Home from '@renderer/views/Home'
import Profile from '@renderer/views/Profile'
import Settings from '@renderer/views/Settings'
import Dashboard from '@renderer/views/Dashboard'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]

const router = createHashRouter(routes)

export default router
