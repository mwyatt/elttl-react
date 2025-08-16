import { NextResponse } from 'next/server'
import { getCurrentYear } from '@/app/lib/year'
import generateFixtures from '@/app/admin/api/season/generate-fixtures/generateFixtures'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const currentYear = await getCurrentYear()

  // Generate the seasons fixtures
  await generateFixtures(currentYear.id, true)

  return NextResponse.json({ message: `Fixtures generated for the ${currentYear.name} season. Don't refresh the page!` }, { status: StatusCodes.OK })
}
