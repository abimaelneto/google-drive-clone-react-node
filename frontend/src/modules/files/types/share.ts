export type SharingPayload = {
  email: string
  actions: { WRITE: boolean; DELETE: boolean }
  recursive?: boolean
}
