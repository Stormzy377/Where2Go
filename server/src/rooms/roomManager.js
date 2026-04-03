const rooms = {}

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}

function createRoom(hostId, hostName) {
    let code = generateCode()

    while (rooms[code]) {
        code = generateCode()
    }

    rooms[code] = {
        code,
        hostId,
        players: [{ id: hostId, name: hostName }],
        suggestions: [],
        status: 'waiting'
    }

    return rooms[code]
}

function joinRoom(code, playerId, playerName) {
    const room = rooms[code]

    if (!room) {
        return { error: 'Sala não encontrada' }
    }

    if (room.status !== 'waiting') {
        return { error: 'Esta sala já está em votação' }
    }

    const already = room.players.find(p => p.name === playerName)
    if (already) {
        return { error: 'Já existe um jogador com esse nome' }
    }

    room.players.push({ id: playerId, name: playerName })
    return room
}

function getRoom(code) {
    return rooms[code] || null
}

function removePlayer(playerId) {
    for (const code in rooms) {
        const room = rooms[code]
        room.players = room.players.filter(p => p.id !== playerId)

        if (room.players.length === 0) {
            delete rooms[code]
        }
    }
}

function addSuggestion(code, playerId, playerName, place) {
    const room = rooms[code]
    if (!room) return { error: 'Sala não encontrada' }

    const already = room.suggestions.find(s => s.playerName === playerName)
    if (already) return { error: 'Você já fez uma sugestão' }

    room.suggestions.push({ playerId, playerName, place, votes: 0 })
    return room
}

function vote(code, placeIndex) {
    const room = rooms[code]
    if (!room) return { error: 'Sala não encontrada' }
    if (room.status !== 'voting') return { error: 'Votação não está ativa' }
    if (!room.suggestions[placeIndex]) return { error: 'lugar inválido' }

    room.suggestions[placeIndex].votes++
    return room
}

function finishVoting(code) {
    const room = rooms[code]
    if (!room) return null

    room.status = 'finished'

    const winner = room.suggestions.reduce((best, current) =>
        current.votes > best.votes ? current : best
    )

    room.winner = winner
    return room
}

module.exports = { createRoom, joinRoom, getRoom, removePlayer, addSuggestion, vote, finishVoting }