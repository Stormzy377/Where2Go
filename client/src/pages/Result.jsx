function Result({ room }) {
    const { winner, suggestions } = room

    const ranked = [...suggestions].sort((a, b) => b.votes - a.votes)

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          maxWidth: "560px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "#666",
            marginBottom: "8px",
            marginTop: "32px",
          }}
        >
          e o vencedor é...
        </p>

        {/* Card do vencedor */}
        <div
          className="card"
          style={{
            width: "100%",
            background: "#FF5C00",
            marginBottom: "32px",
            textAlign: "center",
            padding: "32px",
          }}
        >
          {/* <p style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🏆</p> */}
          <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "8px" }}>
            {winner.place}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
            {winner.votes} votos • sugerido por {winner.playerName}
          </p>
        </div>

        {/* Ranking completo */}
        <div style={{ width: "100%" }}>
          <h3 style={{ marginBottom: "16px" }}>Ranking completo</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {ranked.map((s, index) => (
              <div
                key={index}
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 20px",
                  background: index === 0 ? "#FFF8F0" : "white",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: "1.2rem",
                      color: "#999",
                    }}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <p style={{ fontWeight: 800 }}>{s.place}</p>
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                      por {s.playerName}
                    </p>
                  </div>
                </div>
                <span style={{ fontWeight: 900, fontSize: "1.3rem" }}>
                  {s.votes}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

export default Result