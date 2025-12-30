import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearByName } from '@/app/lib/year'
import { getFixturesByWeekId, getUnfulfilledFixtures } from '@/repository/fixture'
import { getPressByTitleLikeAndPublishedAfter } from '@/repository/content'
import dayjs from 'dayjs'
import { FredHoldenCupWeekTypes, WeekTypes } from '@/constants/Week'

export async function GET (request, { params }) {
  const { year, id } = await params
  const currentYear = await getYearByName(year)

  if (!currentYear) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const connection = await getConnection()

  const [weeks] = await connection.execute(`
      SELECT type, timeStart
      FROM tennisWeek
      WHERE yearId = ?
        AND id = ?
  `, [currentYear.id, id])

  connection.release()

  if (weeks.length === 0) {
    return NextResponse.json(`Unable to find week with id '${id}'`, { status: StatusCodes.NOT_FOUND })
  }

  const week = weeks[0]
  const fixtures = await getFixturesByWeekId(currentYear.id, id)

  let fredHoldenCupPress = []
  if (FredHoldenCupWeekTypes.includes(week.type)) {
      // @todo get weeks value from somewhere
     fredHoldenCupPress = await getPressByTitleLikeAndPublishedAfter('fred', dayjs().subtract(40, 'weeks'))
  }

  let unfulfilledFixtures = []
  if (week.type === WeekTypes.catchup) {
     unfulfilledFixtures = await getUnfulfilledFixtures('fred', dayjs().subtract(40, 'weeks'))
  }

  return NextResponse.json({
    week,
    fixtures,
    fredHoldenCupPress,
    unfulfilledFixtures
  }, { status: StatusCodes.OK })
}
