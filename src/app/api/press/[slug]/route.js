import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { slug } = await params

  const [presses] = await connection.execute(`
      SELECT title, html, timePublished, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = 'press'
        AND slug = :slug
  `, { slug })

  if (presses.length === 0) {
    return NextResponse.json(`Unable to find press with slug '${slug}'`, { status: 404 })
  }

  return NextResponse.json(presses[0], { status: 200 })
}
