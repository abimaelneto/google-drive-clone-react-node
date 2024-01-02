import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { FileNode } from '../../types/fileNode'

export const createFileNodeThunk = createAsyncThunk(
  'fileNodes/create',
  async (payload: Partial<FileNode>) => {
    const { data } = await FileNodesService.create(payload)
    return data
  }
)
