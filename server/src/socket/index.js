const { createRoom, joinRoom, getRoom, removePlayer, addSuggestion, vote, finishVoting } = require('../rooms/roomManager')

const activeTimers = {}

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

        socket.on('suggest_place', ({ roomCode, place }) => {
            const player = getRoom(roomCode)?.players.find(p => p.id === socket.id)
            if (!player) return

            const result = addSuggestion(roomCode, socket.id, player.name, place)
            if (result.error) {
                socket.emit('room_error', { message: result.error })
                return
            }

            io.to(roomCode).emit('room_updated', result)
            console.log(`${player.name} sugeriu: ${place} na sala ${roomCode}`)
        })

        socket.on("start_voting", ({ roomCode }) => {
          const room = getRoom(roomCode);
          if (!room) return;
          if (room.hostId !== socket.id) return;

          room.status = "voting";
          io.to(roomCode).emit("voting_started", room);

          let timeLeft = 10;

          const startTimer = () => {
            activeTimers[roomCode] = setInterval(() => {
              const currentRoom = getRoom(roomCode);
              if (!currentRoom) {
                clearInterval(activeTimers[roomCode]);
                delete activeTimers[roomCode];
                return;
              }

              io.to(roomCode).emit("timer_tick", { timeLeft });

              if (timeLeft === 0) {
                clearInterval(activeTimers[roomCode]);
                delete activeTimers[roomCode];
                const finished = finishVoting(roomCode);
                if (!finished) return;
                io.to(roomCode).emit("voting_finished", finished);
                console.log(`Vencedor: ${finished.winner.place}`);
                return;
              }

              timeLeft--;
            }, 1000);
          };

          setTimeout(startTimer, 500);
        });

        socket.on('vote', ({ roomCode, placeIndex }) => {
            const result = vote(roomCode, placeIndex)
            if (result.error) return

            io.to(roomCode).emit('votes_updated', result.suggestions)
        })

        socket.on("disconnect", () => {
          const result = removePlayer(socket.id);

          if (result?.wasHost && !result.empty) {
            if (activeTimers[result.roomCode]) {
              clearInterval(activeTimers[result.roomCode]);
              delete activeTimers[result.roomCode];
            }
            io.to(result.roomCode).emit("host_left");
            console.log(
              `Host saiu da sala ${result.roomCode} — sala encerrada`,
            );
          }

          console.log(`Desconectado: ${socket.id}`);
        });
    })
}

module.exports = { setupSocket }