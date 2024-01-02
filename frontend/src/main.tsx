import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { AuthProvider } from './contexts/Auth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App>
          <RouterProvider router={router} />
        </App>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
)
