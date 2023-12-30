import { Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import GoogleIcon from '@mui/icons-material/Google'

export const AuthView = ({
  form,
  actions,
}: {
  form: ReactNode
  actions: ReactNode
}) => {
  return (
    <Stack>
      <Stack spacing={2} py={2} direction="row" justifyContent="center">
        <GoogleIcon />
        <Typography fontWeight="600">Google Drive Clone</Typography>
      </Stack>
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
