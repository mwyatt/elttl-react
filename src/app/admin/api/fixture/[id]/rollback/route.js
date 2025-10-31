import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import fulfillFixture from '@/app/admin/api/fixture/[id]/fulfillFixture'
import { StatusCodes } from 'http-status-codes'

export async function POST (request, { params }) {
  const { id } = await params
  const { encounterStruct } = await request.json()

  try {
    await fulfillFixture(id, encounterStruct, true)
  } catch (error) {
    console.error('Error rolling back fixture:', error)
    return NextResponse.json({
      message: error.message
    }, { status: StatusCodes.UNPROCESSABLE_ENTITY })
  }

  return NextResponse.json({
    message: `Fixture ${id} rolled back successfully!`
  }, { status: StatusCodes.OK })
}
