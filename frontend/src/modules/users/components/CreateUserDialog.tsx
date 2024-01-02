import { User } from '@/types/user'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { FormEventHandler, useState } from 'react'

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
}
export const CreateUserDialog = ({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean
  handleClose: () => void
  handleSubmit: (data: Partial<User>) => void
}) => {
  const [data, setData] = useState<{
    name: string
    email: string
    role: string
    password: string
  }>(initialState)
  const handleChange: FormEventHandler<HTMLDivElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement
    setData((old) => ({ ...old, [name]: value }))
  }
  const internalHandleClose = () => {
    handleClose()
    setData(initialState)
  }
  return (
    <Dialog
      open={open}
      onClose={internalHandleClose}
      sx={{ p: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>Creating User</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 4, minWidth: '400px' }}>
          <Stack spacing={2} px={2}>
            <TextField
              onInput={handleChange}
              name="name"
              value={data?.name}
              label="Name"
            />
            <TextField
              onInput={handleChange}
              name="email"
              value={data?.email}
              label="Email"
            />
            <TextField
              onInput={handleChange}
              name="password"
              value={data?.password}
              label="Password"
              type="password"
            />

            <FormGroup>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={data.role}
                onChange={() =>
                  setData((old) => ({
                    ...old,
                    role: old.role == 'ADMIN' ? 'USER' : 'ADMIN',
                  }))
                }
              >
                <FormControlLabel
                  value="ADMIN"
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value="USER"
                  control={<Radio />}
                  label="Common User"
                />
              </RadioGroup>
            </FormGroup>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          py={2}
          justifyContent="space-between"
        >
          <Button onClick={internalHandleClose}>Cancel</Button>
          <Button
            onClick={() => {
              data != null && handleSubmit(data)
              setData(initialState)
            }}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
