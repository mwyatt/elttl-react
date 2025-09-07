import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')

  const [contents] = await connection.execute(`
      SELECT title, html, timePublished, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = :type
        AND slug = :slug
  `, { slug, type })

    connection.release()

  if (contents.length === 0) {

    return NextResponse.json(`Unable to find '${type}' with slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  return NextResponse.json(contents[0], { status: StatusCodes.OK })
}
