import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const [fixtures] = await connection.execute(`
      SELECT 
          tf.id,
          td.name as divisionName,
          ttl.name as teamLeftName,
          ttr.name as teamRightName,
          tf.timeFulfilled
      FROM tennisFixture tf
      LEFT JOIN tennisTeam ttl ON ttl.id = tf.teamIdLeft and ttl.yearId = :yearId
      LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight and ttr.yearId = :yearId
      LEFT JOIN tennisDivision td ON td.id = ttl.divisionId and td.yearId = :yearId
        WHERE tf.yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  return NextResponse.json({
    fixtures
  }, { status: 200 })
}
