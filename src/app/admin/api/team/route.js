import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [teams] = await connection.execute(`
      SELECT tt.id, tt.name, slug, homeWeekday, secretaryId, venueId, divisionId, tt.yearId, td.name as divisionName
      FROM tennisTeam tt
      left join tennisDivision td on tt.divisionId = td.id and td.yearId = tt.yearId
        WHERE tt.yearId = :yearId
      order by td.id
  `, {
    yearId: currentYear.id
  })

  return NextResponse.json({
    teams
  }, { status: 200 })
}
