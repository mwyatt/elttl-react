import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { id } = await params

  const currentYear = await getCurrentYear()

  const [teams] = await connection.execute(`
      SELECT id, name, slug, homeWeekday, secretaryId, venueId, divisionId
      FROM tennisTeam
        WHERE yearId = :yearId
      and id = :id
  `, {
    yearId: currentYear.id,
    id
  })

  return NextResponse.json({
    team: teams[0]
  }, { status: 200 })
}

export async function PUT (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const { name, slug } = await request.json()

  const currentYear = await getCurrentYear()

  const [response] = await connection.execute(`
       UPDATE tennisTeam
       SET name = :name,
           slug = :slug
      WHERE yearId = :yearId and id = :id
  `, {
    yearId: currentYear.id,
    id,
    name,
    slug
  })

  return NextResponse.json({
    affectedRows: response.affectedRows
  }, { status: StatusCodes.OK })
}
