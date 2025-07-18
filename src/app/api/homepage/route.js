import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
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
      ORDER BY timeFulfilled
      LIMIT 6
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

  return NextResponse.json({
    advertisementsPrimary,
    latestPress,
    latestFixtures,
    currentYear: currentYear.name,
    galleryImages: [
      // { id: 1, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0857.jpg' },
      // { id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg' },
      // { id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg' },
      // { id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg' },
      // { id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg' }
    ],
    seasonTotals: {
      divisions: totalDivisions,
      teams: totalTeams,
      players: totalPlayers,
      fixtures: {
        fulfilled: totalFixturesFulfilled,
        total: totalFixturesCount
      }
    }
  }, { status: StatusCodes.OK })
}
