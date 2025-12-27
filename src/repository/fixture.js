import { getConnection } from '@/lib/database'

export async function getFixturesByWeekId (yearId, weekId) {
  const connection = await getConnection()

  const [fixtures] = await connection.execute(`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight,
        timeFulfilled
        from tennisEncounter tte
      inner join tennisFixture ttf on ttf.id = tte.fixtureId
                                          and ttf.yearId = tte.yearId
                                          and ttf.weekId = :weekId
                                          and timeFulfilled is not null
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId,
    weekId
  })

  connection.release()

  return fixtures
}
