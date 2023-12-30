import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../views/Login'
import { AuthLayout } from '../layouts/Auth'
import { SignUp } from '../views/SignUp'

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
])
