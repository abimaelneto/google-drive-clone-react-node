import { createSlice } from '@reduxjs/toolkit'
import { loginThunk } from './thunks/login'
import { API } from '@/service/api'
import { PayloadAction } from '@reduxjs/toolkit/react'
import { User } from '@/types/user'

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
  },
})

export const authReducer = authSlice.reducer
