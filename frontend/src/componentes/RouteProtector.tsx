import { meThunk } from '@/modules/auth/store/thunks/me'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const RouteProtector = () => {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  async function setupUser() {
    if (!user) {
      dispatch(meThunk())
    }
  }
  useEffect(() => {
    setupUser()
  }, [])

  return <>{user && <Outlet />}</>
}
