import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Stack,
  TableBody,
  Typography,
  IconButton,
  Grid,
} from '@mui/material'
import { useEffect } from 'react'
import { listUsersThunk } from '../store/thunks/list'
import { Delete, Edit, Info } from '@mui/icons-material'

export const ListUsers = () => {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((s) => s.users)

  useEffect(() => {
    dispatch(listUsersThunk())
  }, [])
  return (
    <Grid item sm={6} p={2}>
      <Stack sx={{ width: '100%' }} justifyContent="center">
        <Typography variant="h6" align="left">
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton>
                    <Info />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Grid>
  )
}
