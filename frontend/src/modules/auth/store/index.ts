import { createSlice } from '@reduxjs/toolkit'
import { loginThunk } from './thunks/login'
import { PayloadAction } from '@reduxjs/toolkit/react'
import { User } from '@/types/user'
import { meThunk } from './thunks/me'
import { signOutThunk } from './thunks/signOut'

type AuthState = {
  user: User | null
  token: string | null
}

const initialState: AuthState = { user: null, token: null }

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        loginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ data: { user: User }; token: string }>
        ) => {
          state.user = action.payload.data.user
          state.token = action.payload.token
        }
      )
      .addCase(loginThunk.rejected, (state) => {
        state.user = null
      })
      .addCase(meThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const authReducer = authSlice.reducer
