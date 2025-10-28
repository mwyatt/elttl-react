export async function playerGetMany (connection, yearId, playerIds) {
  const playerIdsSql = playerIds.join(',')

  const [players] = await connection.execute(`
      SELECT
          id,
          tp.rank
      FROM tennisPlayer tp
      WHERE yearId = :yearId
      and id in(${playerIdsSql})
  `, {
    yearId
  })

  return players
}