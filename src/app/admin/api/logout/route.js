import { NextResponse } from 'next/server'
import { logout } from '@/app/login/actions'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  logout()

  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [teams] = await connection.execute(`
      SELECT id, name, slug, homeWeekday, secretaryId, venueId, divisionId, yearId
      FROM tennisTeam
        WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  return NextResponse.json({
    teams
  }, { status: StatusCodes.OK })
}
