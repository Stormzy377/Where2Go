// client/src/pages/Stats.jsx
import { useState, useEffect } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3333";

function Stats() {
  const [stats, setStats] = useState(null);
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchStats(pwd) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER_URL}/stats?secret=${pwd}`);
      if (res.status === 401) {
        setError("Senha incorreta");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  // Atualiza as métricas a cada 10 segundos
  useEffect(() => {
    if (!authed || !secret) return;
    const interval = setInterval(() => fetchStats(secret), 10000);
    return () => clearInterval(interval);
  }, [authed, secret]);

  function handleLogin() {
    if (!secret.trim()) return;
    fetchStats(secret);
  }

  // Tela de login
  if (!authed) {
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
        <div className="card" style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{ marginBottom: "8px" }}>Painel de métricas</h2>
          <p
            style={{ color: "#666", marginBottom: "24px", fontSize: "0.9rem" }}
          >
            Acesso restrito
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              className="input"
              type="password"
              placeholder="Senha..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              className="btn btn-primary btn-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    );
  }

  // Dashboard de métricas
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h2>Métricas</h2>
        <span className="badge badge-teal" style={{ fontSize: "0.75rem" }}>
          atualiza a cada 10s
        </span>
      </div>

      {/* Cards de números */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          className="card"
          style={{ textAlign: "center", background: "#FFF0E8" }}
        >
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF5C00" }}>
            {stats.currentOnlineUsers}
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666" }}>
            online agora
          </p>
        </div>

        <div
          className="card"
          style={{ textAlign: "center", background: "#E0FAF7" }}
        >
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#00C2A8" }}>
            {stats.peakOnlineUsers}
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666" }}>
            pico de usuários
          </p>
        </div>

        <div
          className="card"
          style={{ textAlign: "center", background: "#FFFBE0" }}
        >
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#B8860B" }}>
            {stats.totalRoomsCreated}
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666" }}>
            salas criadas
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111" }}>
            {stats.totalGamesFinished}
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666" }}>
            partidas concluídas
          </p>
        </div>
      </div>

      {/* Top lugares */}
      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>Lugares mais votados</h3>
        {stats.topPlaces.length === 0 ? (
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            Nenhuma partida concluída ainda
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {stats.topPlaces.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  border: "2px solid #111",
                  borderRadius: "8px",
                  background: index === 0 ? "#FFF0E8" : "white",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={{ fontWeight: 900, color: "#999" }}>
                    #{index + 1}
                  </span>
                  <span style={{ fontWeight: 800 }}>{item.place}</span>
                </div>
                <span className="badge badge-orange">
                  {item.wins} vitória{item.wins !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="btn btn-ghost btn-full"
        style={{ marginTop: "20px" }}
        onClick={() => fetchStats(secret)}
      >
        Atualizar agora
      </button>
    </div>
  );
}

export default Stats;