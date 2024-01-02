import { Stack } from '@mui/material'
import { ReactNode } from 'react'
import { Logo } from '@/componentes/Logo'

export const AuthView = ({
  form,
  actions,
}: {
  form: ReactNode
  actions: ReactNode
}) => {
  return (
    <Stack>
      <Logo />
      <form>
        <Stack spacing={2} px={4}>
          <Stack sx={{ maxWidth: '40vw' }} spacing={2}>
            {form}
          </Stack>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            {actions}
          </Stack>
        </Stack>
      </form>
    </Stack>
  )
}
