import { Header } from '@/componentes/Header'
import { useAppSelector } from '@/store/hooks'
import { Button, Grid, Stack } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

export const MainLayout = ({ children }: PropsWithChildren) => {
  const user = useAppSelector((s) => s.auth.user)
  return (
    <Stack>
      <Header />
      <Stack>
        <Grid container>
          <Grid item sm={2}>
            <Link to="/dashboard">
              <Button>Home</Button>
            </Link>
            <Link to="/shared">
              <Button>Shared with me</Button>
            </Link>
            {!!user && user.role == 'ADMIN' && (
              <Link to="/users">
                <Button>Users</Button>
              </Link>
            )}
          </Grid>
          {children}
        </Grid>
      </Stack>
    </Stack>
  )
}
