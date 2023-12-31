import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'

export const getFileNodesThunk = createAsyncThunk(
  'fileNodes/get',
  async (nodeId: string) => {
    const { data } = await FileNodesService.get(nodeId)
    return data
  }
)
