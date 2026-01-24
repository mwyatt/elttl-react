import { NextResponse } from 'next/server'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { playerGetAll } from '@/repository/player'
import { getConnection } from '@/lib/database'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const players = await playerGetAll(connection, currentYear.id)

  connection.release()

  return NextResponse.json({
    players
  }, { status: StatusCodes.OK })
}
