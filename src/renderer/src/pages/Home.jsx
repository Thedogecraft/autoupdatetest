import React from 'react'
import Card from '../components/Card'
import Button from '@mui/material/Button'
import cardsData from '../assets/home.json'
function Home() {
  const boost = () => window.electron.ipcRenderer.send('pcBoost')
  return (
    <>
      <h1>Tweaks</h1>
      <div className="boost">
        <Button variant="contained" onClick={boost}>
          Boost PC
        </Button>
      </div>
      <div className="cards">
        {cardsData.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} cmd={card.cmd} />
        ))}
      </div>
    </>
  )
}

export default Home
