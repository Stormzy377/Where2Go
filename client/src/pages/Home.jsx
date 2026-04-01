import { useState, useEffect } from "react";
import socket from '../socket/socket'

function Home({ onEnterRoom }) {
    const [playerName, setPlayerName] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        socket.connect()

        socket.on('room_created', (room) => {
            onEnterRoom(room, playerName)
        })

        socket.on('room_updated', (room) => {
            onEnterRoom(room, playerName)
        })

        socket.on('room_error', ({ message }) => {
            setError(message)
        })

        return () => {
            socket.off('room_created')
            socket.off('room_updated')
            socket.off('room_error')
        }
    }, [playerName, onEnterRoom])

    function handleCreate() {
        if (!playerName.trim()) {
            setError('Digite seu nome antes de criar uma sala')
            return
        }
        setError('')
        socket.emit('create_room', { playerName })
    }

    function handleJoin() {
        if (!playerName.trim()) {
            setError('Digite seu nome')
            return
        }
        if (!roomCode.trim()) {
            setError('Digite o código da sala')
            return
        }
        setError('')
        socket.emit('join_room', { code: roomCode, playerName })
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
          <h1 style={{ marginBottom: "8px" }}>Where2Go</h1>
          <p style={{ color: "#666", marginBottom: "28px" }}>
            Decida com seus amigos para onde sair
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              className="input"
              type="text"
              placeholder="Seu nome..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button className="btn btn-primary btn-full" onClick={handleCreate}>
              Criar sala
            </button>
          </div>

          <hr className="divider" />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              className="input"
              type="text"
              placeholder="Código da sala (ex: ABC123)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <button className="btn btn-secondary btn-full" onClick={handleJoin}>
              Entrar na sala
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    );
}

export default Home