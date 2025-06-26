import createNewSeason from '@/app/admin/api/season/createNewSeason'
import { NextResponse } from 'next/server'

export async function GET (request) {
  const newYearInfo = await createNewSeason()

  return NextResponse.json({ message: `New season ${newYearInfo.newYearName} started successfully. Don't refresh the page!` }, { status: 200 })
}