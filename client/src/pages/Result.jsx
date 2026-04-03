function Result({ room }) {
  const { winner, suggestions } = room;

  const ranked = [...suggestions].sort((a, b) => b.votes - a.votes);

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
        {winner.wasTied && (
          <p
            style={{
              background: "#FFD600",
              color: "#111",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "4px 16px",
              borderRadius: "999px",
              border: "2px solid #111",
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            Empate — lugar sorteado aleatoriamente
          </p>
        )}
        {/* <p style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🏆</p> */}
        <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "8px" }}>
          {winner.place}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
          {winner.votes} votos • sugerido por {winner.playerName}
        </p>
      </div>
    </div>
  );
}

export default Result;
