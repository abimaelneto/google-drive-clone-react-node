import { Button, Dialog, DialogActions, Stack } from '@mui/material'

export const DeleteDialog = ({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean
  handleClose: () => void
  handleSubmit: () => void
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
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
