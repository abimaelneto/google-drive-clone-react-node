import { Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
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
