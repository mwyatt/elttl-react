import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearByName } from '@/app/lib/year'
import { getFixturesByWeekId, getUnfulfilledFixtures, getUnfulfilledFixturesByWeekId } from '@/repository/fixture'
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
  let fixtures = await getFixturesByWeekId(currentYear.id, id)

  let fredHoldenCupPress = []
  if (FredHoldenCupWeekTypes.includes(week.type)) {
    // @todo get weeks value from somewhere
    fredHoldenCupPress = await getPressByTitleLikeAndPublishedAfter('fred', dayjs().subtract(40, 'weeks'))
  }

  let unfulfilledFixtures = []
  if (week.type === WeekTypes.catchup) {
    unfulfilledFixtures = await getUnfulfilledFixtures(currentYear.id)
  } else {
    fixtures = fixtures.concat(await getUnfulfilledFixturesByWeekId(currentYear.id, id))
  }

  const fixturesByDivisionName = {}
  fixtures.forEach(fixture => {
    if (!fixturesByDivisionName[fixture.divisionName]) {
      fixturesByDivisionName[fixture.divisionName] = []
    }
    fixturesByDivisionName[fixture.divisionName].push(fixture)
  })

  return NextResponse.json({
    week,
    fixturesByDivisionName,
    fredHoldenCupPress,
    unfulfilledFixtures
  }, { status: StatusCodes.OK })
}
