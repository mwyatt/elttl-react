import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [advertisementsPrimary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'home-primary'
  `)

  const [advertisementsSecondary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'small-primary'
  `)

  const [latestPress] = await connection.query(`
      SELECT id, timePublished, title, slug
      FROM content
      WHERE type = 'press'
        AND status = 1
      ORDER BY timePublished DESC LIMIT 5
  `)

  const [latestFixtures] = await connection.query(`
      SELECT timeFulfilled,
             ttl.name AS teamLeftName,
             ttl.slug AS teamLeftSlug,
             ttr.name AS teamRightName,
             ttr.slug AS teamRightSlug
      FROM tennisFixture
               LEFT JOIN tennisTeam AS ttl ON tennisFixture.teamIdLeft = ttl.id AND ttl.yearId = :yearId
               LEFT JOIN tennisTeam AS ttr
                         ON tennisFixture.teamIdRight = ttr.id AND ttr.yearId = :yearId
      WHERE tennisFixture.yearId = :yearId
        AND timeFulfilled IS NOT NULL
      ORDER BY timeFulfilled LIMIT 6
  `, {
    yearId: currentYear.id
  })

  latestPress.forEach((press) => {
    press.url = `/press/${press.slug}`
  })

  return NextResponse.json({
    advertisementsPrimary,
    advertisementsSecondary,
    latestPress,
    latestFixtures,
    currentYear: currentYear.name,
    galleryImages: [
      // { id: 1, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0857.jpg' },
      // { id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg' },
      // { id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg' },
      // { id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg' },
      // { id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg' }
    ]
  }, { status: 200 })
}
