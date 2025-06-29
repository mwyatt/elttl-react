import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import {
  getSideCapitalized,
  getSideIndex,
  getSides,
  getSidesCapitalized,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'
import { getRankChanges } from '@/lib/encounter'
import EncounterStatus from '@/constants/EncounterStatus'
import fulfillFixture from '@/app/admin/api/fixture/[id]/fulfillFixture'
import { StatusCodes } from 'http-status-codes'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()
  const { id } = await params

  const [fixtures] = await connection.execute(`
      SELECT 
          tf.id,
          td.name as divisionName,
          ttl.id as teamLeftId,
          ttl.name as teamLeftName,
          ttr.name as teamRightName,
          ttr.id as teamRightId,
          tf.timeFulfilled
      FROM tennisFixture tf
      LEFT JOIN tennisTeam ttl ON ttl.id = tf.teamIdLeft and ttl.yearId = :yearId
      LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight and ttr.yearId = :yearId
      LEFT JOIN tennisDivision td ON td.id = ttl.divisionId and td.yearId = :yearId
        WHERE tf.yearId = :yearId
      and tf.id = :fixtureId
  `, {
    fixtureId: id,
    yearId: currentYear.id
  })

  const fixture = fixtures[0]

  const [players] = await connection.execute(`
      SELECT
          id,
          concat(nameFirst, ' ', nameLast) AS name,
          slug,
          tp.rank,
          teamId
      FROM tennisPlayer tp
      WHERE yearId = :yearId
  `, {
    yearId: currentYear.id
  })

  const [encounters] = await connection.execute(`
      SELECT
          id,
          playerIdLeft,
          playerIdRight,
          scoreLeft,
          scoreRight,
          playerRankChangeLeft,
          playerRankChangeRight,
          playerRankChangeRight,
          status
      FROM tennisEncounter
      WHERE yearId = :yearId and fixtureId = :fixtureId
  `, {
    yearId: currentYear.id,
    fixtureId: id
  })

  return NextResponse.json({
    fixture,
    encounters,
    players
  }, { status: StatusCodes.OK })
}

export async function PUT (request, { params }) {
  const { id } = await params
  const { encounterStruct } = await request.json()

  try {
    await fulfillFixture(id, encounterStruct)
  } catch (error) {
    console.error('Error fulfilling fixture:', error)
    return NextResponse.json({
      message: error.message
    }, { status: StatusCodes.UNPROCESSABLE_ENTITY })
  }

  return NextResponse.json({
    message: `Fixture ${id} fulfilled successfully!`
  }, { status: StatusCodes.OK })
}
