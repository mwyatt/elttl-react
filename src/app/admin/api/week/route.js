import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { persistWeeks } from '@/repository/week'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [weeks] = await connection.execute(`
      SELECT id,
             timeStart,
             type
      FROM tennisWeek
      WHERE yearId = :yearId
      order by timeStart
  `, {
    yearId: currentYear.id
  })

  const [fixtures] = await connection.execute(`
select
    tf.id,
     concat(ttl.name, ' vs ', ttr.name) AS fullName,
    ttl.id as teamLeftId,
    ttl.name as teamLeftName,
    ttl.homeWeekday,
    ttl.divisionId,
    ttr.id as teamRightId,
    ttr.name as teamRightName,
    tf.weekId
from tennisFixture tf
join tennisTeam ttl on tf.teamIdLeft = ttl.id
join tennisTeam ttr on tf.teamIdRight = ttr.id
      where tf.yearId = :yearId
        and ttl.yearId = :yearId
        and ttr.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  const [divisions] = await connection.execute(`
select
    td.id,
    td.name
from tennisDivision td
      where td.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  connection.release()

  return NextResponse.json({
    divisions,
    weeks,
    fixtures
  }, { status: StatusCodes.OK })
}

export async function PUT (request) {
  const { weeks, fixtures } = await request.json()

  try {
    await persistWeeks(weeks, fixtures)
  } catch (error) {
    console.error('Error saving weeks:', error)
    return NextResponse.json({
      message: error.message
    }, { status: StatusCodes.UNPROCESSABLE_ENTITY })
  }

  return NextResponse.json({
    message: `Weeks saved successfully!`
  }, { status: StatusCodes.OK })
}