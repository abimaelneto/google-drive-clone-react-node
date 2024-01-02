import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '../../services'
export const meThunk = createAsyncThunk('auth/me', async () => {
  const res = await AuthService.me()
  return res.data
})
