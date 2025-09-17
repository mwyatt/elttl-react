import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearByName } from '@/app/lib/year'

export async function GET (request, { params }) {
  const { year, slug } = await params
  const currentYear = await getYearByName(year)

  if (!currentYear) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const connection = await getConnection()

  const [venues] = await connection.execute(`
      SELECT id, name, slug, location
      FROM tennisVenue
      WHERE yearId = ?
        AND slug = ?
  `, [currentYear.id, slug])

  if (venues.length === 0) {
    connection.release()

    return NextResponse.json(`Unable to find venue with slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const venue = venues[0]

  const [teams] = await connection.execute(`
      SELECT tt.name, tt.slug, tt.homeWeekday, LOWER(td.name) AS divisionSlug, td.name divisionName
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
      WHERE tt.yearId = ?
        AND tt.venueId = ?
  `, [currentYear.id, venue.id])

  connection.release()

  return NextResponse.json({
    venue,
    teams
  }, { status: StatusCodes.OK })
}
