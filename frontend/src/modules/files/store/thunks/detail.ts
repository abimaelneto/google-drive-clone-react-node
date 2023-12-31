import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { AxiosError } from 'axios'

export const detailFileNodesThunk = createAsyncThunk(
  'fileNodes/detail',
  async (nodeId: string, thunkAPI) => {
    const res = await FileNodesService.get(nodeId)
    if (res instanceof AxiosError) {
      if (res.response?.status == 403)
        return thunkAPI.rejectWithValue('Unauthorized')
    }
    return res.data
  }
)
