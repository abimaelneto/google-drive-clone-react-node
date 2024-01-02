import { signOutThunk } from '@/modules/auth/store/thunks/signOut'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Logout, Person } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
} from '@mui/material'
import Drawer from '@mui/material/Drawer'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const UserMenu = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setIsOpen(open)
    }
  const navigate = useNavigate()

  return (
    <div>
      <Avatar
        onClick={toggleDrawer(true)}
        src={`https://ui-avatars.com/api/?name=${user?.name
          .split(' ')
          .join('+')}&background=FFF`}
      />

      <Drawer anchor={'right'} open={isOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ px: 2, mb: 2 }}>
            {user?.name}
          </Typography>

          <Stack
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            justifyContent="space-between"
          >
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              Profile
            </ListItem>
            <Divider />
            <ListItem
              onClick={() => {
                dispatch(signOutThunk())
                navigate('/login')
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Sign Out
            </ListItem>
          </Stack>
        </Box>
      </Drawer>
    </div>
  )
}
