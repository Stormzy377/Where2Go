const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { setupSocket } = require("./socket/index");

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
]

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST']
}))

app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
})

app.get('/health', (req, res) => {
    res.json({ status: 'servidor rodando' })
})

app.get('/ping', (req, res) => {
    res.json({ mensagem: 'ping', horario: new Date() })
})

setupSocket(io)

const PORT = 3333
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})