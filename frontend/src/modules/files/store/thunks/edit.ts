import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { FileNode } from '../../types/fileNode'

export const editFileNodesThunk = createAsyncThunk(
  'fileNodes/edit',
  async ({ id, payload }: { id: string; payload: Partial<FileNode> }) => {
    const { data } = await FileNodesService.update(id, payload)
    return data
  }
)
