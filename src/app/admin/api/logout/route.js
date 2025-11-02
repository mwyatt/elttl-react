import { NextResponse } from 'next/server'
import { logout } from '@/app/login/actions'
import { StatusCodes } from 'http-status-codes'
import { getCurrentYear } from '@/app/lib/year'
import { getConnection } from '@/lib/database'

export async function GET () {
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

  connection.release()

  return NextResponse.json({
    teams
  }, { status: StatusCodes.OK })
}
