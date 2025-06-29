import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year } = await params

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [year])

  if (currentYears.length === 0) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }
  const currentYear = currentYears[0]

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
           LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = tt.yearId
           LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
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

  return NextResponse.json({ divisions, teamsByDivisionId }, { status: StatusCodes.OK })
}
