import { MainLayout } from '@/layouts/Main'
import { meThunk } from '@/modules/auth/store/thunks/me'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export const RouteProtector = () => {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  async function setupUser() {
    if (!user) {
      dispatch(meThunk())
    }
  }
  useEffect(() => {
    setupUser()
  }, [])

  return (
    <>
      {user && (
        <MainLayout>
          <Outlet />
        </MainLayout>
      )}
    </>
  )
}
