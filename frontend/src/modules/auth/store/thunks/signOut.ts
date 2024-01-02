import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '../../services'
export const signOutThunk = createAsyncThunk('auth/signOut', async () => {
  const res = await AuthService.signOut()
  return res.data
})
