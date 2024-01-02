import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/react'
import { FileNode } from '../types/fileNode'
import { listFileNodesThunk } from './thunks/list'
import { getFileNodesThunk } from './thunks/get'
import { detailFileNodesThunk } from './thunks/detail'
import { startEditingNodeFilesThunk } from './thunks/startEdit'
import { Action } from '../types/permissions'
import { listPermissions } from '../utils/listPermissions'

type FileNodesState = {
  nodes: FileNode[]
  selectedNode: FileNode | null
  detailNode: FileNode | null
  nodeToBeEdited: FileNode | null
}

const initialState: FileNodesState = {
  nodes: [],
  selectedNode: null,
  detailNode: null,
  nodeToBeEdited: null,
}

export const fileNodesSlice = createSlice({
  name: 'fileNodes',
  initialState,
  reducers: {
    resetSelectedNode(state) {
      state.selectedNode = null
    },
    checkPermissionForNode(
      state,
      action: PayloadAction<{ actions: (Action | 'OWNER')[]; email: string }>
    ) {
      const permissions = listPermissions(
        state.detailNode?.permissions,
        action.payload.email
      )

      action.payload.actions.forEach((p) => {
        if (!permissions.includes(p)) throw new Error('Unauthorized')
      })
    },
  },
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
      (state, action: PayloadAction<FileNode | undefined>) => {
        if (action.payload) state.selectedNode = action.payload
      }
    )

    builder.addCase(detailFileNodesThunk.pending, (state) => {
      state.detailNode = null
    })
    builder.addCase(detailFileNodesThunk.rejected, (state) => {
      state.detailNode = null
    })
    builder.addCase(
      detailFileNodesThunk.fulfilled,
      (state, action: PayloadAction<FileNode>) => {
        state.detailNode = action.payload
      }
    )
    builder.addCase(startEditingNodeFilesThunk.pending, (state) => {
      state.nodeToBeEdited = null
    })
    builder.addCase(
      startEditingNodeFilesThunk.fulfilled,
      (state, action: PayloadAction<FileNode>) => {
        state.nodeToBeEdited = action.payload
      }
    )
  },
})

export const fileNodesReducer = fileNodesSlice.reducer

export const { checkPermissionForNode } = fileNodesSlice.actions
