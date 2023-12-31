import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'

export const listFileNodesThunk = createAsyncThunk(
  'fileNodes/list',
  async () => {
    const { data } = await FileNodesService.list()
    return data
  }
)
