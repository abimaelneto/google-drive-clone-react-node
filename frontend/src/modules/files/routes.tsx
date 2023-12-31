import { RouteObject } from 'react-router-dom'
import { Dashboard } from './views/Dashboard'

export const filesRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]
