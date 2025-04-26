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

  const [divisions] = await connection.execute(`
      SELECT id, name
      FROM tennisDivision
        WHERE yearId = :yearId
  `, {
    yearId: currentYear.id,
  })

  return NextResponse.json({
    team: teams[0],
    divisions
  }, { status: 200 })
}

export async function PUT (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const { name, slug, divisionId } = await request.json()

  const currentYear = await getCurrentYear()

  const [response] = await connection.execute(`
       UPDATE tennisTeam
       SET name = :name,
           slug = :slug,
           divisionId = :divisionId
      WHERE yearId = :yearId and id = :id
  `, {
    yearId: currentYear.id,
    id,
    name,
    slug,
    divisionId
  })

  return NextResponse.json({
    affectedRows: response.affectedRows
  }, { status: StatusCodes.OK })
}
