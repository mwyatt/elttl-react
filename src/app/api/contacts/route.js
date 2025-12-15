import { NextResponse } from 'next/server'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { playerGetBySlugs } from '@/repository/player'
import { getConnection } from '@/lib/database'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const players = await playerGetBySlugs(connection, currentYear.id, [
    'david-heys',
    'mick-moir',
    'bryan-edwards',
    'darren-wright',
    'neil-hepworth',
    'colin-hooper',
    'trevor-elkington',
    'ian-pickles',
    'robin-willoughby',
    'harry-rawcliffe',
    'fred-wade',
    'adam-hek'
  ])

  return NextResponse.json({
    players,
    currentYearName: currentYear.name
  }, { status: StatusCodes.OK })
}
