import { useAppDispatch } from '@/store/hooks'
import { useEffect } from 'react'
import { listFileNodesThunk } from '../store/thunks/list'
import { BaseLayout } from '../layouts/Base'

export const Dashboard = () => {
  const dispatch = useAppDispatch()

  const fetchFileNodes = async () => {
    try {
      await dispatch(listFileNodesThunk()).unwrap()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchFileNodes()
  }, [])

  return <BaseLayout />
}
