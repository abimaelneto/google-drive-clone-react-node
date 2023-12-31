import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: { MuiButton: { defaultProps: { fullWidth: true } } },
})
