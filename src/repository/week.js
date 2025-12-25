import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'

export async function persistWeeks (weeks, fixtures) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  // clear all weekIds from tennisFixture table
  await connection.execute(`
      UPDATE tennisFixture
      SET weekId = NULL
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  // clear all weeks from tennisWeek table
  await connection.execute(`
      DELETE
      FROM tennisWeek
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  // insert weeks into this year
  for (const week of weeks) {
    await connection.execute(`
        INSERT INTO tennisWeek (id, yearId, timeStart, type)
        VALUES (:id, :yearId, :timeStart, :type)
    `, {
      id: week.id,
      yearId: currentYear.id,
      timeStart: week.timeStart,
      type: week.type
    })
  }

// Group fixture IDs by weekId
  const weekToFixtureIds = {}
  for (const fixture of fixtures) {
    if (!weekToFixtureIds[fixture.weekId]) {
      weekToFixtureIds[fixture.weekId] = []
    }
    weekToFixtureIds[fixture.weekId].push(fixture.id)
  }

// Update fixtures in batches per weekId
for (const [weekId, fixtureIds] of Object.entries(weekToFixtureIds)) {
  if (fixtureIds.length === 0) continue
  const idsString = fixtureIds.join(',')
  await connection.execute(
    `
      UPDATE tennisFixture
      SET weekId = :weekId
      WHERE id IN (${idsString})
        AND yearId = :yearId
    `,
    {
      weekId,
      yearId: currentYear.id
    }
  )
}

  connection.release()
}

