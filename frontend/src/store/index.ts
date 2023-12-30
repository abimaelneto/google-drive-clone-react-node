import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../modules/store'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
