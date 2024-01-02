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
  Button,
  TablePagination,
  TableContainer,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { listUsersThunk } from '../store/thunks/list'
import { Add, Delete, Info } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { CreateUserDialog } from '../components/CreateUserDialog'
import { createUserThunk } from '../store/thunks/create'
import { User } from '@/types/user'

export const ListUsers = () => {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((s) => s.users)
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCreateUser = async (data: Partial<User>) => {
    try {
      await dispatch(createUserThunk(data)).unwrap()
      dispatch(listUsersThunk())
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.log(err)
      switch (err as string) {
        case 'Bad Request':
          return alert('Please review form data')
        case 'Unauthorized':
          return alert("You don't have the permissions to perform this action")
        default:
          return alert('Something wrong happened. Please Try again later')
      }
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  useEffect(() => {
    dispatch(listUsersThunk())
  }, [])
  return (
    <Grid item sm={8} p={2}>
      <Stack sx={{ width: '100%' }} justifyContent="center">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" align="left" sx={{ flexGrow: 1 }}>
            Users
          </Typography>
          <Button fullWidth={false} onClick={openCreateDialog}>
            <Stack direction="row" spacing={2}>
              <Add />
              <Typography>New</Typography>
            </Stack>
          </Button>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>View</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate('/users/' + user.id)}>
                        <Info />
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
      <CreateUserDialog
        open={isCreateDialogOpen}
        handleClose={() => setIsCreateDialogOpen(false)}
        handleSubmit={handleCreateUser}
      />
    </Grid>
  )
}
