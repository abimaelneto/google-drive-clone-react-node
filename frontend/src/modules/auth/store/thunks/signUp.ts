import { createAsyncThunk } from '@reduxjs/toolkit'
import { SignUpDTO } from '@/modules/auth/types/signUpDTO'
import { AuthService } from '@/modules/auth/services'

export const signUpThunk = createAsyncThunk(
  'auth/signUp',
  async (payload: SignUpDTO) => {
    const response = await AuthService.signUp(payload)
    return response.data
  }
)
