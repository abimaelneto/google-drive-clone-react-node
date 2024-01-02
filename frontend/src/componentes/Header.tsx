import { Logo } from '@/componentes/Logo'
import { AppBar, Stack, Toolbar } from '@mui/material'
import { UserMenu } from './UserMenu'

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Logo />
          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
