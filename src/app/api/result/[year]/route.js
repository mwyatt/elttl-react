import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearByName } from '@/app/lib/year'

export async function GET (request, { params }) {
  const { year } = await params

  const currentYear = await getYearByName(year)

  if (!currentYear) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const connection = await getConnection()

  const [divisions] = await connection.execute(`
      SELECT id, name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id])

  const [teams] = await connection.execute(`
      SELECT tt.name, tt.slug, tt.divisionId teamDivisionId,
          tv.name venueName,
          tv.slug venueSlug,
          tp.slug secretarySlug,
          concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
          tp.phoneLandline secretaryPhoneLandline,
          tp.phoneMobile secretaryPhoneMobile
      FROM tennisTeam tt
           LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = :yearId
           LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = :yearId
        WHERE tt.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  // Map teams to their divisions
  const teamsByDivisionId = {}
  teams.forEach(team => {
    const divisionId = team.teamDivisionId
    if (!teamsByDivisionId[divisionId]) {
      teamsByDivisionId[divisionId] = []
    }
    teamsByDivisionId[divisionId].push(team)
  })

  connection.release()

  return NextResponse.json({ divisions, teamsByDivisionId }, { status: StatusCodes.OK })
}
