import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileNodesService } from '../../services'
import { SharingOptions } from '../../types/share'
import { Action } from '../../types/permissions'

export const shareFileNodesThunk = createAsyncThunk(
  'fileNodes/share',
  async ({ id, payload }: { id: string; payload: SharingOptions }) => {
    const tranformedPayload = {
      ...payload,
      actions: Object.keys(payload.actions)
        .filter((a) => !!a)
        .concat(['READ']) as Action[],
    }
    const { data } = await FileNodesService.share(id, tranformedPayload)
    return data
  }
)
