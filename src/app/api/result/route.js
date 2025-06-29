import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const connection = await getConnection()

  const [years] = await connection.query(`
      SELECT name
      FROM tennisYear
      ORDER BY id ASC
  `)

  return NextResponse.json(years, { status: StatusCodes.OK })
}
