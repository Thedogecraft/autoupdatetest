import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { useNavigate } from 'react-router-dom'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function Warning() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  React.useEffect(() => {
    const warningagree = localStorage.getItem('warningagree')
    if (!warningagree) {
      setOpen(true)
      localStorage.setItem('warningagree', 'true')
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDisagree = () => {
    localStorage.removeItem('warningagree')
    navigate('/')
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">⚠️ Warning</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          YOU ARE HEADING TO ADVANCED SETTINGS <p>some of these settings can break your computer</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>Disagree</Button>
        <Button onClick={handleClose} variant="contained">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
