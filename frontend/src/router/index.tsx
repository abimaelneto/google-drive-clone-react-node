import { createBrowserRouter } from 'react-router-dom'
import { Login } from '@/modules/auth/views/Login'
import { AuthLayout } from '@/modules/auth/layouts/Auth'
import { SignUp } from '@/modules/auth/views/SignUp'
import { filesRoutes } from '@/modules/files/routes'
import { RouteProtector } from '@/componentes/RouteProtector'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
        id: 'login',
      },
      {
        path: 'register',
        element: <SignUp />,
        id: 'register',
      },
    ],
  },
  { path: '/', element: <RouteProtector />, children: filesRoutes },
])
