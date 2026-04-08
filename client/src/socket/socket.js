import { io } from 'socket.io-client'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3333'

const socket = io(SERVER_URL, {
    autoConnetct: false
})

export default socket