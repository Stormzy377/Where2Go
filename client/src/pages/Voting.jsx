import { useState, useEffect } from 'react'
import socket from '../socket/socket'

function Voting({ room: initialRoom }) {
    const [suggestions, setSuggestions] = useState(initialRoom.suggestions);
    const [timeLeft, setTimeLeft] = useState(10)
    const [voted, setVoted] = useState(null)

    useEffect(() => {
        socket.on('votes_updated', (updatedSuggestions) => {
            setSuggestions(updatedSuggestions)
        })

        socket.on('timer_tick', ({ timeLeft }) => {
            setTimeLeft(timeLeft)
        })

        return () => {
            socket.off('votes_updated')
            socket.off('timer_tick')
        }
    }, [])

    function handleVote(placeIndex) {
        setVoted(placeIndex)
        socket.emit('vote', {
            roomCode: initialRomm.code,
            placeIndex
        })
    }

    const totalVotes = suggestions.reduce((sum, s) => sum + s.votes, 0)

    const timerColor = timeLeft > 5 ? '#00C2A8' : timeLeft > 2 ? '#FFD600' : '#FF5C00'

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          maxWidth: "560px",
          margin: "0 auto",
        }}
      >
        {/* Timer */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontWeight: 700, color: "#666", marginBottom: "8px" }}>
            tempo restante
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              border: "3px solid #111",
              borderRadius: "50%",
              background: timerColor,
              boxShadow: "5px 5px 0px #111",
              transition: "background 0.3s",
            }}
          >
            <span
              style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111" }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Instrução */}
        <p
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.1rem",
            marginBottom: "24px",
          }}
        >
          Clique no lugar que você prefere!
        </p>

        {/* Cards de votação */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {suggestions.map((s, index) => {
            const percentage =
              totalVotes > 0 ? Math.round((s.votes / totalVotes) * 100) : 0;
            const isVoted = voted === index;

            return (
              <button
                key={index}
                onClick={() => handleVote(index)}
                style={{
                  width: "100%",
                  padding: "20px",
                  border: isVoted ? "3px solid #FF5C00" : "2.5px solid #111",
                  borderRadius: "12px",
                  background: isVoted ? "#FFF0E8" : "white",
                  boxShadow: isVoted ? "4px 4px 0 #FF5C00" : "4px 4px 0 #111",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.1s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Barra de progresso de fundo */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${percentage}%`,
                    background: "#FFD600",
                    opacity: 0.3,
                    transition: "width 0.3s ease",
                    borderRadius: "10px",
                  }}
                />

                {/* Conteúdo do card */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        marginBottom: "2px",
                      }}
                    >
                      {s.place}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                      sugerido por {s.playerName}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 900, fontSize: "1.4rem" }}>
                      {s.votes}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#666" }}>
                      {percentage}%
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: "0.85rem",
            marginTop: "20px",
          }}
        >
          Total de votos: {totalVotes}
        </p>
      </div>
    );
}

export default Voting