import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/react'
import { FileNode } from '../types/fileNode'
import { listFileNodesThunk } from './thunks/list'
import { getFileNodesThunk } from './thunks/get'
import { detailFileNodesThunk } from './thunks/detail'

type FileNodesState = {
  nodes: FileNode[]
  selectedNode: FileNode | null
  detailNode: FileNode | null
}

const initialState: FileNodesState = {
  nodes: [],
  selectedNode: null,
  detailNode: null,
}

export const fileNodesSlice = createSlice({
  name: 'fileNodes',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(listFileNodesThunk.pending, (state) => {
      state.nodes = []
      state.selectedNode = null
    })
    builder.addCase(
      listFileNodesThunk.fulfilled,
      (state, action: PayloadAction<FileNode[]>) => {
        state.nodes = action.payload
      }
    )
    builder.addCase(
      getFileNodesThunk.fulfilled,
      (state, action: PayloadAction<FileNode>) => {
        state.selectedNode = action.payload
      }
    )
    builder.addCase(detailFileNodesThunk.pending, (state) => {
      state.detailNode = null
    })
    builder.addCase(
      detailFileNodesThunk.fulfilled,
      (state, action: PayloadAction<FileNode>) => {
        state.detailNode = action.payload
      }
    )
  },
})

export const fileNodesReducer = fileNodesSlice.reducer
