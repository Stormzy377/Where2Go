import { useState } from "react";
import Home from './pages/Home'
import Room from './pages/Room'
import Voting from './pages/Voting'
import Result from './pages/Result'
import socket from './socket/socket'
import { useEffect } from "react";

function App() {
  const [room, setRoom] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [screen, setScreen] = useState('home')
  const [finishedRoom, setFinishedRoom] = useState(null)

  useEffect(() => {
    socket.on('voting_started', (updatedRoom) => {
      setRoom(updatedRoom)
      setScreen('voting')
    })

    socket.on('voting_finished', (finishedRoom) => {
      setFinishedRoom(finishedRoom)
      setScreen('result')
    })

    return () => {
      socket.off('voting_started')
      socket.off('voting_finished')
    }
  }, [])

  function handleEnterRoom(roomData, name) {
    setRoom(roomData)
    setPlayerName(name)
    setScreen('room')
  }

  if (screen === 'voting' && room) return <Voting room={room} />
  if (screen === 'result' && finishedRoom) return <Result room={finishedRoom} />
  if (screen === 'room' && room) return <Room room={room} playerName={playerName} />
  return <Home onEnterRoom={handleEnterRoom} />
}

export default App