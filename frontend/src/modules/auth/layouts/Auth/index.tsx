import { Stack } from '@mui/material'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useLocation, useNavigate } from 'react-router-dom'

export const AuthLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!['/login', '/register'].includes(location.pathname)) {
      navigate('/login')
    }
  }, [])
  return (
    <Stack
      sx={{ width: '100vw', height: '100vh', background: 'lightgrey' }}
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        spacing={2}
        sx={{ maxWidth: '50vw' }}
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
      </Stack>
    </Stack>
  )
}
