import { useState, useEffect } from "react";
import socket from '../socket/socket'

function Room({ room: initialRoom, playerName }) {
    const [room, setRoom] = useState(initialRoom)
    const [suggestion, setSuggestion] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        socket.on('room_updated', (updatedRoom) => {
            setRoom(updatedRoom)
        })

        return () => {
            socket.off('room_updated')
        }
    }, [])

    function handleSuggest() {
        if (!suggestion.trim()) {
            setError('Digite um lugar antes de sugerir')
            return
        }
        setError('')
        socket.emit('suggest_place', {
            roomCode: room.code,
            place: suggestion.trim()
        })
        setSuggestion('')
    }

    const alreadySuggested = room.suggestions.some(
        s => s.playerName === playerName
    )

    const isHost = room.hostId === socket.id

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          maxWidth: "560px",
          margin: "0 auto",
        }}
      >
        {/* Cabeçalho da sala */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <h2>Sala</h2>
            <span
              className="badge badge-yellow"
              style={{ fontSize: "1rem", letterSpacing: "0.05em" }}
            >
              {room.code}
            </span>
          </div>
          <p style={{ color: "#666" }}>
            Olá, <strong>{playerName}</strong>!
          </p>
        </div>

        {/* Lista de participantes */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            Participantes ({room.players.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {room.players.map((player) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  border: "2px solid #111",
                  borderRadius: "8px",
                  background: player.name === playerName ? "#FFF8F0" : "white",
                }}
              >
                <span style={{ fontWeight: 700 }}>{player.name}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {player.id === room.hostId && (
                    <span
                      className="badge badge-orange"
                      style={{ fontSize: "0.7rem" }}
                    >
                      host
                    </span>
                  )}
                  {player.name === playerName && (
                    <span
                      className="badge badge-teal"
                      style={{ fontSize: "0.7rem" }}
                    >
                      você
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sugestão de lugar */}
        {!alreadySuggested ? (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "16px" }}>Sugira um lugar</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                className="input"
                type="text"
                placeholder="Ex: Feira do Kilamba..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSuggest()}
              />
              <button
                className="btn btn-primary btn-full"
                onClick={handleSuggest}
              >
                Sugerir lugar
              </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>
        ) : (
          <div
            className="card"
            style={{
              marginBottom: "20px",
              background: "#F0FFF8",
              borderColor: "#00C2A8",
            }}
          >
            <p style={{ fontWeight: 700, color: "#00C2A8" }}>
              ✓ Sugestão enviada!
            </p>
            <p style={{ color: "#666", marginTop: "4px", fontSize: "0.9rem" }}>
              Aguarde os outros participantes sugerirem
            </p>
          </div>
        )}

        {/* Lista de sugestões */}
        {room.suggestions.length > 0 && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "16px" }}>
              Sugestões ({room.suggestions.length})
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {room.suggestions.map((s, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    border: "2px solid #111",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{s.place}</span>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    por {s.playerName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão iniciar votação (só o host vê) */}
        {isHost && room.suggestions.length >= 2 && (
          <button
            className="btn btn-teal btn-full"
            onClick={() => socket.emit("start_voting", { roomCode: room.code })}
          >
            Iniciar votação →
          </button>
        )}

        {/* Mensagem para quem não for o host */}
        {!isHost && room.suggestions.length < 2 && (
          <p style={{ textAlign: "center", color: "#999", fontSize: "0.9rem" }}>
            Aguardando mais sugestões para iniciar a votação...
          </p>
        )}
      </div>
    );
}

export default Room