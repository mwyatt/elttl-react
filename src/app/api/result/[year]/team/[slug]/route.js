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
  `, [currentYear.id, slug]);
  const team  =teams[0]

  const [players] = await connection.execute(`
      SELECT
          concat(nameFirst, ' ', nameLast) AS name,
          slug
      FROM tennisPlayer
      WHERE yearId = ?
        AND teamId = ?
  `, [currentYear.id, team.id]);

  return NextResponse.json({
    team: team,
    players: players
  }, { status: 200 })
}