import electronLogo from './assets/electron.svg'
import Layout from './components/Layout'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Settings from './pages/Settings'
import First from './components/First'
import { useEffect } from 'react'
import Other from './pages/Other'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <First />
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<Other />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
