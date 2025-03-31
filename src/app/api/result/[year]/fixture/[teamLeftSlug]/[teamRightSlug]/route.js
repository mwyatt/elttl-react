import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, teamLeftSlug, teamRightSlug } = await params

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [year])
  const currentYear = currentYears[0]

  const [teamLefts] = await connection.execute(`
      select id, name, venueId
      from tennisTeam
      where slug = ?
        and yearId = ?
  `, [teamLeftSlug, currentYear.id])
  const teamLeft = teamLefts[0]

  const [teamRights] = await connection.execute(`
      select id, name
      from tennisTeam
      where slug = ?
        and yearId = ?
  `, [teamRightSlug, currentYear.id])
  const teamRight = teamRights[0]

  const [venuess] = await connection.execute(`
      select name, slug
      from tennisVenue
      where id = ?
        and yearId = ?
  `, [teamLeft.venueId, currentYear.id])
  const venue = venuess[0]

  const [fixtures] = await connection.execute(`
      select id, timeFulfilled
      from tennisFixture
      where teamIdLeft = ?
        and teamIdRight = ?
        and yearId = ?
        and timeFulfilled IS NOT NULL
  `, [teamLeft.id, teamRight.id, currentYear.id])
  const fixture = fixtures[0]

  const [encounters] = await connection.execute(`
      select CONCAT(tp.nameFirst, ' ', tp.nameLast)   AS playerLeftName,
             tp.slug                                  AS playerLeftSlug,
             te.playerRankChangeLeft,
             te.scoreLeft,
             CONCAT(tpr.nameFirst, ' ', tpr.nameLast) AS playerRightName,
             tpr.slug                                 AS playerRightSlug,
             te.playerRankChangeRight,
             te.scoreRight,
             te.status
      from tennisEncounter te
               inner join tennisPlayer tp on te.playerIdLeft = tp.id and tp.yearId = :yearId
               inner join tennisPlayer tpr on te.playerIdRight = tpr.id AND tpr.yearId = :yearId
      where te.fixtureId = :fixtureId
        and te.yearId = :yearId
  `, {
    yearId: currentYear.id,
    fixtureId: fixture.id
  })

  return NextResponse.json({
    teamLeft,
    teamRight,
    venue,
    fixture,
    encounters
  }, { status: 200 })
}
