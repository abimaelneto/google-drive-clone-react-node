import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'

export const detailFileNodesThunk = createAsyncThunk(
  'fileNodes/detail',
  async (nodeId: string) => {
    const { data } = await FileNodesService.get(nodeId)
    return data
  }
)
