import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { AxiosError } from 'axios'
import { isOwner } from '../../utils/isOwner'
import { hasPermission } from '../../utils/hasPermission'
import { RootState } from '@/store'
import { User } from '@/types/user'

export const detailFileNodesThunk = createAsyncThunk(
  'fileNodes/detail',
  async (nodeId: string, thunkAPI) => {
    const res = await FileNodesService.get(nodeId)

    const globalState = thunkAPI.getState() as RootState
    if (
      (res instanceof AxiosError && res.response?.status == 403) ||
      (res.data?.permissions &&
        !isOwner(
          res.data?.permissions,
          (globalState.auth.user as User).email
        ) &&
        !hasPermission(res.data?.permissions, 'READ'))
    )
      return thunkAPI.rejectWithValue('Unauthorized')

    return res.data
  }
)
