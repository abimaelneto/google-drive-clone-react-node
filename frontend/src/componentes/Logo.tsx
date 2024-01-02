import { Google } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

export const Logo = () => {
  return (
    <Stack spacing={2} py={2} direction="row" justifyContent="center">
      <Google />
      <Typography fontWeight="600">Google Drive Clone</Typography>
    </Stack>
  )
}
