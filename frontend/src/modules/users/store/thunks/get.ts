import { createAsyncThunk } from '@reduxjs/toolkit'
import { UsersService } from '../../services'

export const getUserThunk = createAsyncThunk(
  'users/get',
  async (id: string) => {
    const { data } = await UsersService.get(id)
    return data
  }
)
