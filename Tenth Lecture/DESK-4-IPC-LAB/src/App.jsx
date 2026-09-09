import { useState } from 'react'
import './App.css'

function App() {

  return (
    <div>
      <button onClick={() => {
        window.music.start()
      }}>
        Start
      </button>

      <button onClick={() => {
        window.music.pause()
      }}>Play</button>

      <button onClick={() => {
        window.music.pause()
      }}>Pause</button>

    </div>
  )
}

export default App
