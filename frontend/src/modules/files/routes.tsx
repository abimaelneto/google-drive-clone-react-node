import { RouteObject } from 'react-router-dom'
import { Dashboard } from './views/Dashboard'
import { Folder } from './views/Folder'

export const filesRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/folders/:fileNodeId',
    element: <Folder />,
  },
]
