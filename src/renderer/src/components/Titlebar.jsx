import React, { useEffect } from 'react'
import { IconMinus, IconSquare, IconX } from '@tabler/icons-react'
import icon from '../../../../resources/sparkle.png'
function Titlebar() {
  useEffect(() => {
    const { ipcRenderer } = window.electron

    const handleMinimize = () => ipcRenderer.send('manualMinimize')
    const handleMaximize = () => ipcRenderer.send('manualMaximize')
    const handleClose = () => ipcRenderer.send('manualClose')

    document.querySelector('#minimize').addEventListener('click', handleMinimize)
    document.querySelector('#maximize').addEventListener('click', handleMaximize)
    document.querySelector('#close').addEventListener('click', handleClose)

    // Cleanup event listeners on component unmount
    return () => {
      document.querySelector('#minimize').removeEventListener('click', handleMinimize)
      document.querySelector('#maximize').removeEventListener('click', handleMaximize)
      document.querySelector('#close').removeEventListener('click', handleClose)
    }
  }, [])

  return (
    <nav style={{ WebkitAppRegion: 'drag' }}>
      <div id="title">
        <img src={icon} width={15} className="titleicon" />
        Sparkle
      </div>
      <div className="nav-buttons">
        <button id="minimize">
          <IconMinus stroke={2} size={15} />
        </button>
        <button id="maximize">
          <IconSquare stroke={2} size={15} />
        </button>
        <button id="close">
          <IconX stroke={2} size={15} />
        </button>
      </div>
    </nav>
  )
}

export default Titlebar
