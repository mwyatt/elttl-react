import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import { NonEventTypes, WeekTypes } from '@/constants/Week'

export async function GET () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [advertisementsPrimary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'home-primary'
  `)

  const [latestPress] = await connection.query(`
      SELECT id, timePublished, title, slug
      FROM content
      WHERE type = 'press'
        AND status = 1
      ORDER BY timePublished DESC
      LIMIT 5
  `)

  const [latestFixtures] = await connection.execute(`
      select ttl.name        teamLeftName,
             ttl.slug        teamLeftSlug,
             sum(scoreLeft)  scoreLeft,
             ttr.name        teamRightName,
             ttr.slug        teamRightSlug,
             sum(scoreRight) scoreRight,
             timeFulfilled
      from tennisEncounter tte
               inner join tennisFixture ttf on ttf.id = tte.fixtureId
          and ttf.yearId = tte.yearId
          and timeFulfilled is not null
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = :yearId
        AND timeFulfilled IS NOT NULL
        and status != 'exclude'
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
      ORDER BY timeFulfilled DESC
      LIMIT 10
  `, {
    yearId: currentYear.id
  })

  latestPress.forEach((press) => {
    press.url = `/press/${press.slug}`
  })

  // Season
  // Season 2025-2026
  // Divisions - 4
  const [divisions] = await connection.execute(`
      SELECT id
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id])
  const totalDivisions = divisions.length

  // Teams playing in the 2025-2026 season - 32
  const [teams] = await connection.execute(`
      SELECT id
      FROM tennisTeam
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })
  const totalTeams = teams.length

  // Players registered in the 2025-2026 season - 200
  const [players] = await connection.execute(`
      SELECT id
      FROM tennisPlayer
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })
  const totalPlayers = players.length
  // Fixtures fulfilled in the 2025-2026 season - 100/200
  const [fixtures] = await connection.execute(`
      SELECT id
      FROM tennisFixture
      WHERE yearId = :yearId
        AND timeFulfilled IS NOT NULL
  `, {
    yearId: currentYear.id
  })
  const totalFixturesFulfilled = fixtures.length

  // total fixtures
  const [totalFixtures] = await connection.execute(`
      SELECT id
      FROM tennisFixture
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })
  const totalFixturesCount = totalFixtures.length

  // this week
  const [weeks] = await connection.execute(`
      SELECT id,
              timeStart,
              type
      FROM tennisWeek
      WHERE yearId = :yearId
        AND timeStart = :timeStart
  `, {
    yearId: currentYear.id,
    timeStart: dayjs().startOf('week').unix()
  })
  let thisWeek = null
  let weekFixtures = []
  if (weeks.length > 0) {
    const theWeek = weeks[0]
    if (theWeek && theWeek.type === WeekTypes.fixture) {
      thisWeek = theWeek
      const [thisWeekFixtures] = await connection.execute(`
            SELECT id
            FROM tennisFixture
            WHERE yearId = :yearId
              AND weekId = :weekId
        `, {
        yearId: currentYear.id,
        weekId: thisWeek.id
      })
      weekFixtures = thisWeekFixtures
    }
  }

  const typesSql = Object.values(NonEventTypes).join(',')

  // this week
  const [upcomingEventWeeks] = await connection.execute(`
      SELECT id,
              timeStart,
              type
      FROM tennisWeek
      WHERE yearId = :yearId
        AND timeStart >= :timeStart
        AND type NOT IN(${typesSql})
      ORDER BY timeStart
LIMIT 1;
  `, {
    yearId: currentYear.id,
    timeStart: dayjs().unix()
  })
  let upcomingEventWeek = null
  if (upcomingEventWeeks.length > 0) {
    upcomingEventWeek = upcomingEventWeeks[0]
  }

  connection.release()

  return NextResponse.json({
    advertisementsPrimary,
    latestPress,
    latestFixtures,
    currentYear: currentYear.name,
    seasonTotals: {
      divisions: totalDivisions,
      teams: totalTeams,
      players: totalPlayers,
      fixtures: {
        fulfilled: totalFixturesFulfilled,
        total: totalFixturesCount
      }
    },
    thisWeek,
    upcomingEventWeek,
    weekFixtures
  }, { status: StatusCodes.OK })
}
