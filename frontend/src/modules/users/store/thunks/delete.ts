import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { UsersService } from '../../services'

export const deleteUserThunk = createAsyncThunk(
  'ssers/delete',
  async (nodeId: string, thunkAPI) => {
    const res = await UsersService.delete(nodeId)
    if (res instanceof AxiosError) {
      if (res.response?.status == 403)
        return thunkAPI.rejectWithValue('Unauthorized')
    }
    return res.data
  }
)
