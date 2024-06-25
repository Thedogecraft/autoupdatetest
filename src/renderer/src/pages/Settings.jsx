import { Button, Snackbar } from '@mui/material'
import React from 'react'
import packageJson from '../../../../package.json'
function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <Button variant="contained" onClick={localStorage.clear()} color="error">
        Clear All data
      </Button>
      <p>
        Sparkle: Version {packageJson.version} ©️ {packageJson.author}
      </p>
    </>
  )
}

export default Settings
