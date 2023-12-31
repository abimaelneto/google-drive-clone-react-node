import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: {
    MuiButton: { defaultProps: { fullWidth: true } },
    MuiIconButton: { styleOverrides: { root: { cursor: 'pointer' } } },
  },
})
