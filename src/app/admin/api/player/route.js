import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [players] = await connection.execute(`
    SELECT
      id,
      yearId,
      nameFirst,
      nameLast,
      slug,
      tp.rank,
      phoneLandline,
      phoneMobile,
      ettaLicenseNumber,
      teamId
      FROM tennisPlayer tp
        WHERE tp.yearId = :yearId
      order by tp.nameLast
  `, {
    yearId: currentYear.id
  })

    connection.release()

  return NextResponse.json({
    players
  }, { status: StatusCodes.OK })
}
