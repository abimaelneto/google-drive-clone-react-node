import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'

export const DeleteDialog = ({
  open,
  name,
  handleClose,
  handleSubmit,
}: {
  open: boolean
  name?: string
  handleClose: () => void
  handleSubmit: () => void
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          py={2}
          justifyContent="space-between"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Continue
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
