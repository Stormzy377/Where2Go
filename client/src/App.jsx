import { useState } from "react";
import Home from './pages/Home'

function App() {
  const [room, setRoom] = useState(null)
  const [playerName, setPlayerName] = useState('')

  function handleEnterRoom(roomData, name) {
    setRoom(roomData)
    setPlayerName(name)
  }

  if (room) {
    return (
      <div>
        <h2>Você está na sala {room.code}</h2>
        <pre>{JSON.stringify(room, null, 2)}</pre>
      </div>
    )
  }

  return <Home onEnterRoom={handleEnterRoom} />
}

export default App