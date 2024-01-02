import { Action } from './permissions'

export type SharingPayload = {
  email: string
  actions: Action[]
  recursive?: boolean
}
export type SharingOptions = {
  email: string
  actions: { WRITE: boolean; DELETE: boolean }
  recursive?: boolean
}
