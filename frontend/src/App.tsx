import { PropsWithChildren, useEffect } from 'react'
import './global.css'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'

function App({ children }: PropsWithChildren) {
  const test = async () => {
    const res = await fetch('http://localhost:3000')
    console.log(await res.text())
  }
  useEffect(() => {
    test()
  })
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default App
