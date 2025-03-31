import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import encounterStatus from '@/constants/encounterStatus'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, division } = await params

  const [yearDivisionIds] = await connection.execute(`
      SELECT td.id AS divisionId,
             ty.id AS yearId
      FROM tennisDivision td
               LEFT JOIN tennisYear ty ON ty.id = td.yearId
      WHERE ty.name = ?
        AND td.name = ?
  `, [year, division])

  const yearDivisionId = yearDivisionIds[0]

  const [teams] = await connection.execute(`
      SELECT name, slug
      FROM tennisTeam
        WHERE yearId = :yearId
        AND divisionId = :divisionId
  `, {
    divisionId: yearDivisionId.divisionId,
    yearId: yearDivisionId.yearId
  })

  const [leagueTable] = await connection.execute(`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight
        from tennisEncounter tte
      left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    and ttl.divisionId = :divisionId
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug

  `, {
    divisionId: yearDivisionId.divisionId,
    yearId: yearDivisionId.yearId
  })

  return NextResponse.json({
    leagueTable,
    teams
  }, { status: 200 })
}
