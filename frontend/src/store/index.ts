import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/modules/auth/store'
import { fileNodesReducer } from '@/modules/files/store'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fileNodes: fileNodesReducer,
  },
})

export type Store = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
