import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { AxiosError } from 'axios'

export const deleteFileNodesThunk = createAsyncThunk(
  'fileNodes/delete',
  async (nodeId: string, thunkAPI) => {
    const res = await FileNodesService.delete(nodeId)
    if (res instanceof AxiosError) {
      if (res.response?.status == 403)
        return thunkAPI.rejectWithValue('Unauthorized')
    }
    return res.data
  }
)
