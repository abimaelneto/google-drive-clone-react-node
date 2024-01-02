import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { FormEventHandler, useState } from 'react'
import { FileNode } from '../types/fileNode'

export const CreateDialog = ({
  handleClose,
  handleSubmit,
  type,
}: {
  handleClose: () => void
  handleSubmit: (data: Partial<FileNode>) => void
  type: 'file' | 'folder' | ''
}) => {
  const [data, setData] = useState<Partial<FileNode>>({ name: '', content: '' })
  const handleChange: FormEventHandler<HTMLDivElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement
    setData((old) => ({ ...old, [name]: value }))
  }

  return (
    <Dialog
      open={Boolean(type)}
      onClose={handleClose}
      sx={{ p: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>Creating {type}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 4, minWidth: '400px' }}>
          <Stack spacing={2} px={2}>
            <TextField
              onInput={handleChange}
              name="name"
              value={data?.name}
              label="Name"
            />
            {type == 'file' && (
              <TextField
                multiline={true}
                name="content"
                onInput={handleChange}
                value={data?.content}
                label="Content"
              />
            )}
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              data != null && handleSubmit(data)
              setData({})
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
