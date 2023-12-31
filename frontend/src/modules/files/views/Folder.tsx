import { useAppDispatch } from '@/store/hooks'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFileNodesThunk } from '../store/thunks/get'

import { BaseLayout } from '../layouts/Base'
export const Folder = () => {
  const dispatch = useAppDispatch()

  const params = useParams()
  const fetchFolder = async (nodeId: string) => {
    if (!nodeId) return
    try {
      await dispatch(getFileNodesThunk(nodeId as string)).unwrap()
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchFolder(params.fileNodeId as string)
  }, [params.fileNodeId])
  return <BaseLayout />
}
