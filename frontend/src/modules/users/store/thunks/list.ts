import { createAsyncThunk } from '@reduxjs/toolkit'
import { UsersService } from '../../services'

export const listUsersThunk = createAsyncThunk('users/list', async () => {
  const { data } = await UsersService.list()
  return data
})
