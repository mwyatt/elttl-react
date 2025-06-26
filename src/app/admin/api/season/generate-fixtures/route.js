import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import generateFixtures from '@/app/admin/api/season/generate-fixtures/generateFixtures'

export async function GET (request) {
  const currentYear = await getCurrentYear()

  // Generate the seasons fixtures
  await generateFixtures(currentYear.id)

  return NextResponse.json({ message: `Fixtures generated for the ${currentYear.name} season. Don't refresh the page!` }, { status: 200 })
}
