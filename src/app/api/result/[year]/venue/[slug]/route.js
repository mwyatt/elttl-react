import { NextResponse } from 'next/server'
import {getConnection} from "@/lib/database";

export async function GET(request, {params}) {
  const connection = await getConnection()
  const {year, slug} = await params

      const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [year]);
  const currentYear = currentYears[0]

  const [venues] = await connection.execute(`
      SELECT id, name, slug, location
      FROM tennisVenue
      WHERE yearId = ?
        AND slug = ?
  `, [currentYear.id, slug]);
  const venue = venues[0]

  const [teams] = await connection.execute(`
      SELECT tt.name, tt.slug, tt.homeWeekday, LOWER(td.name) AS divisionSlug, td.name divisionName
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
      WHERE tt.yearId = ?
        AND tt.venueId = ?
  `, [currentYear.id, venue.id]);

  return NextResponse.json({
      venue: venue,
      teams: teams
  }, { status: 200 })
}