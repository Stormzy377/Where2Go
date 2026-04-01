const { createRoom, joinRoom, getRoom, removePlayer } = require('../rooms/roomManager')

function setupSocket(io) {

    io.on('connection', (socket) => {
        console.log(`Conectado: ${socket.id}`)

        socket.on('create_room', ({ playerName }) => {
            const room = createRoom(socket.id, playerName)

            socket.join(room.code)

            socket.emit('room_created', room)

            console.log(`Sala criada: ${room.code} por ${playerName}`)
        })

        socket.on('join_room', ({ code, playerName }) => {
            const result = joinRoom(code.toUpperCase(), socket.id, playerName)

            if (result.error) {
                socket.emit('room_error', { message: result.error })
                return
            }

            socket.join(result.code)

            io.to(result.code).emit('room_updated', result)

            console.log(`${playerName} entrou na sala ${result.code}`)
        })

        socket.on('disconnect', () => {
            removePlayer(socket.id)
            console.log(`Desconectado: ${socket.id}`)
        })
    })
}

module.exports = { setupSocket }