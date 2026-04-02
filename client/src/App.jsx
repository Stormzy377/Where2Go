import { useState } from "react";
import Home from './pages/Home'
import Room from './pages/Room'

function App() {
  const [room, setRoom] = useState(null)
  const [playerName, setPlayerName] = useState('')

  function handleEnterRoom(roomData, name) {
    setRoom(roomData)
    setPlayerName(name)
  }

  if (room) {
    return <Room room={room} playerName={playerName} />
  }

  return <Home onEnterRoom={handleEnterRoom} />
}

export default App