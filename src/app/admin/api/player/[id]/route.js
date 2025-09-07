import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const isCreate = id === 'create'
  let players = []

  const currentYear = await getCurrentYear()

  if (isCreate) {
    players = [
      {
        id: 'create',
        nameFirst: '',
        nameLast: '',
        slug: '',
        rank: '',
        phoneLandline: '',
        phoneMobile: '',
        ettaLicenseNumber: '',
        teamId: 0,
      }
    ]
  } else {
      [players] = await connection.execute(`
      SELECT
        id,
        yearId,
        nameFirst,
        nameLast,
        slug,
        tp.rank,
        phoneLandline,
        phoneMobile,
        ettaLicenseNumber,
        teamId
        FROM tennisPlayer tp
          WHERE tp.yearId = :yearId
          and tp.id = :id
        order by tp.nameLast
    `, {
      yearId: currentYear.id,
      id
    })
  }

  const [teams] = await connection.execute(`
      SELECT id, name, slug, homeWeekday, secretaryId, venueId, divisionId
      FROM tennisTeam
        WHERE yearId = :yearId
      order by name
  `, {
    yearId: currentYear.id,
  })

    connection.release()

  return NextResponse.json({
    player: players[0],
    teams
  }, { status: StatusCodes.OK })
}

export async function PUT (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const { player } = await request.json()
  const isCreate = id === 'create'
  let affectedPlayerId = id
  let response = []

  const currentYear = await getCurrentYear()

  if (isCreate) {
    [response] = await connection.execute(`
         INSERT INTO tennisPlayer (yearId, nameFirst, nameLast, slug, \`rank\`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId)
         VALUES (:yearId, :nameFirst, :nameLast, :slug, :rank, :phoneLandline, :phoneMobile, :ettaLicenseNumber, :teamId)
    `, {
      yearId: currentYear.id,
      ...player
    })
    affectedPlayerId = response.insertId
  } else {
    [response] = await connection.execute(`
         UPDATE tennisPlayer
         SET 
             nameFirst = :nameFirst,
             nameLast = :nameLast,
             slug = :slug,
             \`rank\` = :rank,
             phoneLandline = :phoneLandline,
             phoneMobile = :phoneMobile,
             ettaLicenseNumber = :ettaLicenseNumber,
             teamId = :teamId
        WHERE yearId = :yearId and id = :id
    `, {
      yearId: currentYear.id,
      id,
      ...player
    })

  }

        const [players] = await connection.execute(`
      SELECT
        id,
        yearId,
        nameFirst,
        nameLast,
        slug,
        tp.rank,
        phoneLandline,
        phoneMobile,
        ettaLicenseNumber,
        teamId
        FROM tennisPlayer tp
          WHERE tp.yearId = :yearId
          and tp.id = :id
    `, {
      yearId: currentYear.id,
      id: affectedPlayerId
    })

    connection.release()

  return NextResponse.json({
    message: isCreate ? 'Player created successfully!' : 'Player updated successfully!',
    player: players[0],
    affectedRows: response.affectedRows
  }, { status: StatusCodes.OK })
}
