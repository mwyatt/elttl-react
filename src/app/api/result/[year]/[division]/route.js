import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import EncounterStatus from '@/constants/EncounterStatus'
import { StatusCodes } from 'http-status-codes'

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
      SELECT tt.name, tt.slug,
          tv.name venueName,
          tv.slug venueSlug,
          tp.slug secretarySlug,
          concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
          tp.phoneLandline secretaryPhoneLandline,
          tp.phoneMobile secretaryPhoneMobile
      FROM tennisTeam tt
           LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = tt.yearId
           LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
        WHERE tt.yearId = :yearId
        AND tt.divisionId = :divisionId
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
  }, { status: StatusCodes.OK })
}
