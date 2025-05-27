import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, slug } = await params

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [year])
  const currentYear = currentYears[0]
  console.log(currentYear)

  const [teams] = await connection.execute(`
      SELECT
          tt.id,
          tt.name,
          tt.slug,
          tt.homeWeekday,
          LOWER(td.name) AS divisionSlug,
          td.name divisionName,
          tv.name venueName,
          tv.slug venueSlug,
      concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
      tp.slug secretarySlug
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
               LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND td.yearId = tt.yearId
               LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
      WHERE tt.yearId = ?
        AND tt.slug = ?
  `, [currentYear.id, slug])
  const team = teams[0]

  const [players] = await connection.execute(`
      SELECT
          concat(nameFirst, ' ', nameLast) AS name,
          tennisPlayer.rank,
          slug
      FROM tennisPlayer
      WHERE yearId = ?
        AND teamId = ?
  `, [currentYear.id, team.id])

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
                                          and (ttf.teamIdLeft = :teamId OR ttf.teamIdRight = :teamId)
                                          and timeFulfilled is not null
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId: currentYear.id,
    teamId: team.id
  })

  return NextResponse.json({
    team,
    players,
    fixtures
  }, { status: 200 })
}
