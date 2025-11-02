import createNewSeason from '@/app/admin/api/season/createNewSeason'
import { NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

export async function GET () {
  const newYearInfo = await createNewSeason()

  return NextResponse.json({ message: `New season ${newYearInfo.newYearName} started successfully. Don't refresh the page!` }, { status: StatusCodes.OK })
}
