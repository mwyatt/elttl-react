import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

// @todo get all press paginated
export async function GET (request) {
  const connection = await getConnection()

  // @todo paginated

  const [presses] = await connection.execute(`
      SELECT title, timePublished, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = 'press'
     limit 0, 10   
  `, { slug })

  return NextResponse.json(press, { status: 200 })
}
