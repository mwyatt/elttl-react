import { getConnection } from '@/lib/database'

export async function getRankMeritEncountersByDivisionId (yearId, divisionId) {
  const connection = await getConnection()

  const [encounters] = await connection.execute(`
    select
        tte.id,
        tte.playerIdLeft,
        tte.playerRankChangeLeft,
        tte.scoreLeft,
        tte.playerIdRight,
        tte.playerRankChangeRight,
        tte.scoreRight
    from tennisEncounter tte
    left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
    left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    and tte.playerIdLeft > 0
    and tte.playerIdRight > 0
    and ttl.divisionId = :divisionId
  `, {
    divisionId,
    yearId
  })

  connection.release()

  return encounters
}
