import { useAppSelector } from '@/store/hooks'

export const Dashboard = () => {
  const { user } = useAppSelector((x) => x.auth)
  return (
    <>
      <pre>{user?.email}</pre>
      <pre>{user?.name}</pre>
    </>
  )
}
