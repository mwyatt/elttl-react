import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import createNewSeason from '@/app/admin/api/season/createNewSeason'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [fixturesFulfilled] = await connection.execute(`
      SELECT 
          count(tf.id) as fixtureCount
      FROM tennisFixture tf
        WHERE tf.yearId = :yearId and tf.timeFulfilled IS NOT NULL
  `, {
    yearId: currentYear.id
  })

  const [fixturesUnfulfilled] = await connection.execute(`
      SELECT 
          count(tf.id) as fixtureCount
      FROM tennisFixture tf
        WHERE tf.yearId = :yearId and tf.timeFulfilled IS NULL
  `, {
    yearId: currentYear.id
  })

  const [fixturesTotal] = await connection.execute(`
      SELECT 
          count(tf.id) as fixtureCount
      FROM tennisFixture tf
        WHERE tf.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  const fixtureStats = {
    fulfilled: fixturesFulfilled[0].fixtureCount,
    unfulfilled: fixturesUnfulfilled[0].fixtureCount,
    total: fixturesTotal[0].fixtureCount
  }

  return NextResponse.json({
    currentYear,
    fixtureStats
  }, { status: 200 })
}
