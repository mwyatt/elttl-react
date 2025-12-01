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

export async function playerGetBySlugs (connection, yearId, slugs) {
  const playerSlugsSql = slugs.map(
    (slug) => `'${slug}'`
  ).join(',')

  const [players] = await connection.execute(`
      SELECT
          id,
          concat(nameFirst, ' ', nameLast) AS name,
          slug
      FROM tennisPlayer tp
      WHERE yearId = :yearId
      and slug in(${playerSlugsSql})
  `, {
    yearId
  })

  return players
}
