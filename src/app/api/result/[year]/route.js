import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year } = await params

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [year])

  if (currentYears.length === 0) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: 404 })
  }
  const currentYear = currentYears[0]

  const [divisions] = await connection.execute(`
      SELECT name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id])

  return NextResponse.json(divisions, { status: 200 })
}
