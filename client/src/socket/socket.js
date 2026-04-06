import { io } from 'socket.io-client'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
console.log('Conectado em:', SERVER_URL)

const socket = io(SERVER_URL, {
    autoConnetct: false
})

export default socket