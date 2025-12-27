import { NextResponse } from 'next/server'
import { getYearByName } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { getAllWeeksByYear } from '@/repository/week'

export async function GET (request, { params }) {
  const { year } = await params
  const requestedYear = await getYearByName(year)

    if (!requestedYear) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const weeks = await getAllWeeksByYear(requestedYear.id)

  return NextResponse.json({
    weeks
  }, { status: StatusCodes.OK })
}
