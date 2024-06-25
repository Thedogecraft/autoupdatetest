import React from 'react'
import Button from '@mui/material/Button'
// Import ipcRenderer from Electron

const Card = ({ title, description, cmd }) => {
  const handleClick = () => window.electron.ipcRenderer.send(cmd)

  return (
    <div className="card scard">
      <div className="cardswitch">
        <Button variant="contained" onClick={handleClick}>
          APPLY
        </Button>
      </div>
      <div>{title}</div>
      <p>{description}</p>
    </div>
  )
}

export default Card
