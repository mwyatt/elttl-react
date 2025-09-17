import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearByName } from '@/app/lib/year'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, slug } = await params

  const currentYear = await getYearByName(year)

  if (!currentYear) {
    return NextResponse.json(`Unable to find year with name '${year}'`, { status: StatusCodes.NOT_FOUND })
  }

  const [players] = await connection.execute(`
      SELECT tp.id,
             concat(nameFirst, ' ', nameLast) AS name,
             tp.slug,
             tp.rank,
             tp.phoneMobile,
             tp.phoneLandline,
             teamId,
             tt.name                          AS teamName,
             tt.slug                          AS teamSlug,
             tt.divisionId
      FROM tennisPlayer tp
               left join tennisTeam tt on tp.teamId = tt.id and tt.yearId = tp.yearId
      WHERE tp.yearId = ?
        AND tp.slug = ?
  `, [currentYear.id, slug])

  if (players.length === 0) {
    connection.release()

    return NextResponse.json(`Unable to find player within year name '${year}' and slug '${slug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const player = players[0]

  const [fixtures] = await connection.execute(`
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
          and (ttf.teamIdLeft = :teamId OR ttf.teamIdRight = :teamId)
          and timeFulfilled is not null
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = :yearId
        and status != 'exclude'
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId: currentYear.id,
    teamId: player.teamId
  })

  const [encounters] = await connection.execute(`
      select tte.id,
             scoreLeft,
             scoreRight,
             CONCAT(ttpl.nameFirst, ' ', ttpl.nameLast) playerLeftName,
             ttpl.slug                                  playerLeftSlug,
             CONCAT(ttpr.nameFirst, ' ', ttpr.nameLast) playerRightName,
             ttpr.slug                                  playerRightSlug,
             playerRankChangeLeft,
             playerRankChangeRight
      from tennisEncounter tte
               left join tennisPlayer ttpl on ttpl.id = tte.playerIdLeft and ttpl.yearId = tte.yearId
               left join tennisPlayer ttpr on ttpr.id = tte.playerIdRight and ttpr.yearId = tte.yearId
      where tte.yearId = :yearId
        and (tte.playerIdLeft = :playerId OR tte.playerIdRight = :playerId)
  `, {
    yearId: currentYear.id,
    playerId: player.id
  })

  connection.release()

  return NextResponse.json({
    player,
    encounters,
    fixtures
  }, { status: StatusCodes.OK })
}
