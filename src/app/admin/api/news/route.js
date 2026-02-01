import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [news] = await connection.execute(`
    SELECT
      id,
      title,
      slug,
      html,
      timePublished,
      status,
      userId
      FROM content c
      order by c.timePublished DESC
    limit 30
  `, {
    yearId: currentYear.id
  })

  connection.release()

  return NextResponse.json({
    news
  }, { status: StatusCodes.OK })
}
