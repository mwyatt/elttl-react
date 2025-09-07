import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import ContentStatus from '@/constants/ContentStatus'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const connection = await getConnection()
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const limit = 10
  const page = searchParams.get('page')
  const offset = (page - 1) * limit

  const sqlAppend = `LIMIT ${limit} OFFSET ${offset}`

  const [contents] = await connection.execute(`
      SELECT title, timePublished, slug, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = :type
        and status = :status
      order by timePublished desc
          ${sqlAppend}
  `, { type, status: ContentStatus.PUBLISHED })

  connection.release()

  return NextResponse.json(contents, { status: StatusCodes.OK })
}
