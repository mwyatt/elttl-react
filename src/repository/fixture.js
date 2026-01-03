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
        timeFulfilled,
        ttd.name divisionName
        from tennisEncounter tte
      inner join tennisFixture ttf on ttf.id = tte.fixtureId
                                          and ttf.yearId = tte.yearId
                                          and ttf.weekId = :weekId
                                          and timeFulfilled is not null
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
        left join tennisDivision ttd on ttd.id = ttl.divisionId and ttd.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled, divisionName
  `, {
    yearId,
    weekId
  })

  connection.release()

  return fixtures
}

export async function getUnfulfilledFixtures (yearId) {
  const connection = await getConnection()

  const [fixtures] = await connection.execute(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             '0'      scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
             '0'      scoreRight,
             timeFulfilled
      from tennisFixture ttf
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
      where ttf.yearId = :yearId
        and ttf.timeFulfilled is null
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId
  })

  connection.release()

  return fixtures
}

export async function getUnfulfilledFixturesByWeekId (yearId, weekId) {
  const connection = await getConnection()

  const [fixtures] = await connection.execute(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             '0'      scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
             '0'      scoreRight,
             timeFulfilled,
                     ttd.name divisionName
      from tennisFixture ttf
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
              left join tennisDivision ttd on ttd.id = ttl.divisionId and ttd.yearId = ttf.yearId
      where ttf.yearId = :yearId
        and ttf.weekId = :weekId
        and ttf.timeFulfilled is null
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled, divisionName
  `, {
    yearId,
    weekId
  })

  connection.release()

  return fixtures
}
