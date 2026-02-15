import { getConnection } from '@/lib/database'

export async function getTeamsByDivisionId (yearId, divisionId) {
  const connection = await getConnection()

  const [teams] = await connection.execute(`
    select
        id,
        name,
        slug
    from tennisTeam
    where yearId = :yearId
    and divisionId = :divisionId
  `, {
    divisionId,
    yearId
  })

  connection.release()

  return teams
}
