import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { getCurrentYear } from '@/app/lib/year'

export async function GET (request, { params }) {
  // const connection = await getConnection()
  const currentYear = await getCurrentYear()

  return NextResponse.json({
    currentYear
  }, { status: StatusCodes.OK })
}
