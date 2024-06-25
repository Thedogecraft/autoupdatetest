import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function First() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setOpen(true)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDisagree = () => {
    const { ipcRenderer } = window.electron
    ipcRenderer.send('manualClose')
    localStorage.clear()
    handleClose() // Close the dialog after handling disagreement
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
          <ul>
            <li>
              We cannot assure a specific FPS improvement or measurable performance gain from our
              optimizations. Each system and configuration varies.
            </li>
            <br />
            <li>Before running Sparkle, ensure you have created a system restore point.</li>
            <br />
            <li>If uncertain about a particular optimization, refrain from applying it.</li>
          </ul>
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
