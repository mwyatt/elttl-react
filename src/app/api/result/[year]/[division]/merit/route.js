import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getYearDivisionId } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'
import { uniq } from 'lodash'
import { getEncounterMerit } from '@/lib/encounter'

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

  let stats = getEncounterMerit(encounters)
  const playerIds = stats.map(s => s.player.id)

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
