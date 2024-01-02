import { createAsyncThunk } from '@reduxjs/toolkit'
import { UsersService } from '../../services'
import { User } from '@/types/user'
import { AxiosError } from 'axios'

export const createUserThunk = createAsyncThunk(
  'users/create',
  async (payload: Partial<User>, thunkAPI) => {
    const res = await UsersService.create(payload)
    if (res instanceof AxiosError) {
      if (res.response?.status) {
        switch (res.response?.status) {
          case 403:
            return thunkAPI.rejectWithValue('Unauthorized')
          case 400:
            return thunkAPI.rejectWithValue('Bad Request')
          default:
            return thunkAPI.rejectWithValue('Server Error')
        }
      }
    }
    return res.data
  }
)
