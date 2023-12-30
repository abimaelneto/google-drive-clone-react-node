import { PropsWithChildren, useEffect } from 'react'
import './global.css'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { Provider } from 'react-redux'
import { store } from './store'

function App({ children }: PropsWithChildren) {
  const test = async () => {
    const res = await fetch('http://localhost:3000')
    console.log(await res.text())
  }
  useEffect(() => {
    test()
  })
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  )
}

export default App
