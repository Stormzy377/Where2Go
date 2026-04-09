import { useState, useEffect } from "react";
import Home from './pages/Home'
import Room from './pages/Room'
import Voting from './pages/Voting'
import Result from './pages/Result'
import ConnectionStatus from "./components/ConnectionStatus"
import socket from './socket/socket'
import Stats from "./pages/Stats"

function App() {
  const [room, setRoom] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [screen, setScreen] = useState('home')
  const [finishedRoom, setFinishedRoom] = useState(null)
  const [hostLeft, setHostLeft] = useState(false)

  if (window.location.pathname === '/stats') {
    if (window.location.pathname === '/stats')
      return <Stats />
  }

  useEffect(() => {
    socket.on('voting_started', (updatedRoom) => {
      setRoom(updatedRoom)
      setScreen('voting')
    })

    socket.on('voting_finished', (finishedRoom) => {
      setFinishedRoom(finishedRoom)
      setScreen('result')
    })

    socket.on('host_left', () => {
      setHostLeft(true)
      setScreen('home')
      setRoom(null)
    })

    return () => {
      socket.off('voting_started')
      socket.off('voting_finished')
      socket.off('host_left')
    }
  }, [])

  function handleEnterRoom(roomData, name) {
    setRoom(roomData)
    setPlayerName(name)
    setScreen('room')
  }

  return (
    <>
      <ConnectionStatus />

      {hostLeft && screen === "home" && (
        <div
          style={{
            maxWidth: "420px",
            margin: "24px auto 0",
            padding: "0 24px",
          }}
        >
          <div
            className="card"
            style={{
              background: "#FFF0F0",
              borderColor: "#FF3B3B",
              boxShadow: "4px 4px 0 #FF3B3B",
              marginBottom: "16px",
            }}
          >
            <p
              style={{ fontWeight: 800, color: "#FF3B3B", marginBottom: "4px" }}
            >
              ⚠ O host saiu da sala
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              A sala foi encerrada. Crie uma nova sala para continuar.
            </p>
          </div>
        </div>
      )}

      {screen === "voting" && room && <Voting room={room} />}
      {screen === "result" && finishedRoom && <Result room={finishedRoom} />}
      {screen === "room" && room && (
        <Room room={room} playerName={playerName} />
      )}
      {screen === "home" && <Home onEnterRoom={handleEnterRoom} />}
    </>
  );

  // if (screen === 'voting' && room) return <Voting room={room} />
  // if (screen === 'result' && finishedRoom) return <Result room={finishedRoom} />
  // if (screen === 'room' && room) return <Room room={room} playerName={playerName} />
  // if (screen === 'home' && <Home onEnterRoom={handleEnterRoom} />)
  // return <Home onEnterRoom={handleEnterRoom} />
}

export default App