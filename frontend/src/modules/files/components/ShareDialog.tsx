import {
  Box,
  Button,
  Checkbox,
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
  Typography,
} from '@mui/material'
import { FormEventHandler, useState } from 'react'
import { SharingOptions } from '../types/share'

const initialData = {
  actions: { WRITE: false, DELETE: false },
  recursive: false,
  email: '',
}

export const ShareDialog = ({
  handleClose,
  handleSubmit,
  name,
}: {
  handleClose: () => void
  handleSubmit: (data: SharingOptions) => void
  name?: string
}) => {
  const [data, setData] = useState<SharingOptions>(initialData)
  const handleChange: FormEventHandler<HTMLDivElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement
    setData((old) => ({ ...old, [name]: value }))
  }
  const handleToggleAction = (action: 'WRITE' | 'DELETE') => {
    setData((old) => ({
      ...old,
      actions: { ...old.actions, [action]: !old.actions[action] },
    }))
  }
  const internalHandleClose = () => {
    setData(initialData)
    handleClose()
  }
  return (
    <Dialog
      open={Boolean(name)}
      onClose={internalHandleClose}
      sx={{ p: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>Sharing Options for {name}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 4, minWidth: '400px' }}>
          <Stack spacing={2} px={2}>
            <TextField
              onInput={handleChange}
              name="email"
              value={data.email}
              label="Email"
              type="email"
              placeholder="Share with"
            />
            <Typography>
              Which actions would you like to allow the user to perform on{' '}
              <strong>{name}</strong>?
            </Typography>
            <FormGroup>
              <FormControlLabel
                disabled={true}
                control={<Checkbox defaultChecked />}
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleToggleAction('WRITE')}
                    value={data.actions.WRITE}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleToggleAction('DELETE')}
                    value={data.actions.DELETE}
                  />
                }
                label="Delete"
              />
            </FormGroup>
            <Typography>
              Do you want the permissions to be recursive(to be applied on
              nested files and folders too)?
            </Typography>
            <FormGroup>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={data.recursive}
                onChange={() =>
                  setData((old) => ({ ...old, recursive: !old.recursive }))
                }
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No"
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
              setData(initialData)
            }}
            variant="contained"
            disabled={!data.email}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
