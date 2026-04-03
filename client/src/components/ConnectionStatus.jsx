import { useEffect, useState,  } from "react";
import socket from '../socket/socket'

function ConnectionStatus() {
    const [connected, setConnected] = useState(socket.connected)
    const [show, setShow] = useState(false)

    useEffect(() => {
        socket.on('connect', () => {
            setConnected(true)
            setShow(true)
            setTimeout(() => setShow(false), 2500)
        })

        socket.on('disconnect', () => {
            setConnected(false)
            setShow(true)
        })

        return () => {
            socket.off('connect')
            socket.off('disconnect')
        }
    }, [])

    if (!show) return null

    return (
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "12px 24px",
          border: "2.5px solid #111",
          borderRadius: "999px",
          background: connected ? "#00C2A8" : "#FF3B3B",
          color: "white",
          fontWeight: 800,
          fontSize: "0.9rem",
          boxShadow: "4px 4px 0 #111",
          whiteSpace: "nowrap",
          animation: "slideUp 0.2s ease",
        }}
      >
        {connected ? "✓ Conexão restabelecida" : "⚠ Conexão perdida..."}
      </div>
    );
}

export default ConnectionStatus