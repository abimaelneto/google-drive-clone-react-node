import { RouteObject } from 'react-router-dom'
import { ListUsers } from './views/List'
export const usersRoutes: RouteObject[] = [
  {
    path: '/users',
    element: <ListUsers />,
  },
]
