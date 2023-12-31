import { LoginDTO } from '@/modules/auth/types/loginDTO'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '../../services'
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginDTO) => {
    const { data } = await AuthService.login(payload)
    return data
  }
)
