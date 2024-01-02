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
import { FormEventHandler, useEffect, useState } from 'react'
import { FileNode } from '../types/fileNode'
import { useAppSelector } from '@/store/hooks'

export const EditDialog = ({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean
  handleClose: () => void

  handleSubmit: (data: Partial<FileNode>) => void
}) => {
  const { nodeToBeEdited } = useAppSelector((s) => s.fileNodes)
  const [data, setData] = useState(nodeToBeEdited || { name: '', content: '' })
  const handleChange: FormEventHandler<HTMLDivElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement

    setData((old) => ({ ...old, [name]: value }))
  }
  useEffect(() => {
    if (nodeToBeEdited != null) setData(nodeToBeEdited)
  }, [nodeToBeEdited])
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ p: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>Editing {nodeToBeEdited?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 4, minWidth: '400px' }}>
          <Stack spacing={2} px={2}>
            <TextField
              onInput={handleChange}
              name="name"
              value={data?.name}
              label="Name"
            />
            {!nodeToBeEdited?.isFolder && (
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
            onClick={() => data != null && handleSubmit(data)}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
