import { LoginDTO } from '@/modules/auth/types/loginDTO'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '../../services'
import { API } from '@/service/api'
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginDTO) => {
    const res = await AuthService.login(payload)
    API.setupPrivateApi(res.data.token, res.headers['Set-Cookie'])
    return res.data
  }
)
