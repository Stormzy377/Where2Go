const stats = {
    totalRoomsCreated: 0,
    totalGamesFinished: 0,
    peakOnlineUsers: 0,
    currentOnlineUsers: 0,
    placesHistory: {}
}

function incrementRoomsCreated() {
    stats.totalRoomsCreated++
}

function incrementGamesFinished(winner) {
    stats.totalGamesFinished++

    const place = winner.place
    stats.placesHistory[place] = (stats.placesHistory[place] || 0) + 1
}

function updateOnlineUsers(count) {
    stats.currentOnlineUsers = count
    if (count > stats.peakOnlineUsers) {
        stats.peakOnlineUsers = count
    }
}

function getStats() {
    const topPlaces = Object.entries(stats.placesHistory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([place, wins]) => ({ place, wins }))

    return {
      currentOnlineUsers: stats.currentOnlineUsers,
      peakOnlineUsers: stats.peakOnlineUsers,
      totalRoomsCreated: stats.totalRoomsCreated,
      totalGamesFinished: stats.totalGamesFinished,
      topPlaces
    }
}

module.exports = {
    incrementRoomsCreated,
    incrementGamesFinished,
    updateOnlineUsers,
    getStats
} 