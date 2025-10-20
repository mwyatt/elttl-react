import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getYearDivisionId } from '@/app/lib/year'
import { getOtherSideCapitalized, getSidesCapitalized } from '@/constants/encounter'
import { StatusCodes } from 'http-status-codes'
import { uniq } from 'lodash'

export async function GET (request, { params }) {
  const { year, division } = await params
  const yearDivisionId = await getYearDivisionId(year, division)

  if (!yearDivisionId) {
    return NextResponse.json(`Unable to find division with year name '${year}' and slug '${division}'`, { status: StatusCodes.NOT_FOUND })
  }

  const connection = await getConnection()

  const [encounters] = await connection.execute(`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        concat(tpl.nameFirst, ' ', tpl.nameLast) AS playerLeftName,
        tpl.id playerLeftId,
        tpl.slug playerLeftSlug,
        tpl.rank playerLeftRank,
        tte.scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        concat(tpr.nameFirst, ' ', tpr.nameLast) AS playerRightName,
        tpr.id playerRightId,
        tpr.slug playerRightSlug,
        tpr.rank playerRightRank,
        tte.scoreRight                                                                  
        from tennisEncounter tte
      left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
        left join tennisPlayer tpl on tpl.id = tte.playerIdLeft and tpl.yearId = tte.yearId
        left join tennisPlayer tpr on tpr.id = tte.playerIdRight and tpr.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    and ttl.divisionId = :divisionId
    
   # exclude absent players
    and tpl.id > 0
    and tpr.id > 0
  `, {
    divisionId: yearDivisionId.divisionId,
    yearId: yearDivisionId.yearId
  })

  const sides = getSidesCapitalized()
  let stats = {}
  const playerIds = []

  for (const encounter of encounters) {
    for (const side of sides) {
      const playerSlug = encounter[`player${side}Slug`]
      const playerId = encounter[`player${side}Id`]
      playerIds.push(playerId)
      if (!(playerSlug in stats)) {
        stats[playerSlug] = {
          player: {
            id: playerId,
            name: encounter[`player${side}Name`],
            slug: playerSlug,
            rank: encounter[`player${side}Rank`]
          },
          team: {
            name: encounter[`team${side}Name`],
            slug: encounter[`team${side}Slug`]
          },
          won: 0,
          played: 0,
          encounter: 0,
          average: 0
        }
      }

      const score = parseInt(encounter[`score${side}`])
      const opposingScore = parseInt(encounter[`score${getOtherSideCapitalized(side)}`])
      stats[playerSlug].won += score
      stats[playerSlug].played += (score + opposingScore)
      stats[playerSlug].encounter++
    }
  }

  // calculate average
  for (const playerSlug in stats) {
    stats[playerSlug].average = stats[playerSlug].won / stats[playerSlug].played
  }

  // sort by average
  stats = Object.values(stats).sort((a, b) => {
    return b.average - a.average
  })

  const uniquePlayerIds = uniq(playerIds)
  const playerIdsQuery = uniquePlayerIds.join(',')

  const [teamDivisions] = await connection.execute(`
    select
        tp.id,
        tt.divisionId
    from tennisPlayer tp
    left join tennisTeam tt on tt.id = tp.teamId and tt.yearId = tp.yearId
    where tp.yearId = :yearId
    and tp.id IN (${playerIdsQuery})
  `, {
    yearId: yearDivisionId.yearId,
    playerIds: playerIdsQuery
  })

  // Get all player ids which are not in the current division and remove them from stats
  const playerIdsNotInDivision = teamDivisions.filter(td => td.divisionId !== yearDivisionId.divisionId).map(td => td.id)

  stats = stats.filter(s => !playerIdsNotInDivision.includes(s.player.id))

  connection.release()

  return NextResponse.json({
    stats
  }, { status: StatusCodes.OK })
}
