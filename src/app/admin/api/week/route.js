import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [weeks] = await connection.execute(`
    SELECT
      id,
      timeCommencing,
      type
      FROM tennisWeek
        WHERE yearId = :yearId
      order by timeCommencing
  `, {
    yearId: currentYear.id
  })

  connection.release()

  return NextResponse.json({
    weeks
  }, { status: StatusCodes.OK })
}
