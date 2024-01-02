import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'

export const startEditingNodeFilesThunk = createAsyncThunk(
  'fileNodes/startEditing',
  async (nodeId: string) => {
    const { data } = await FileNodesService.get(nodeId)
    return data
  }
)
