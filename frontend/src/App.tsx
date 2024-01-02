import { PropsWithChildren } from 'react'
import './global.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'

function App({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default App
