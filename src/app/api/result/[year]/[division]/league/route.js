import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import encounterStatus from '@/constants/encounterStatus'
import { getYearDivisionId } from '@/app/lib/year'
import { getOtherSide, getOtherSideCapitalized, getSidesCapitalized } from '@/constants/encounter'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, division } = await params

  const yearDivisionId = await getYearDivisionId(year, division)

  const [leagueTable] = await connection.execute(`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight
        from tennisEncounter tte
      left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = :yearId
    and status != 'exclude'
    and ttl.divisionId = :divisionId
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug

  `, {
    divisionId: yearDivisionId.divisionId,
    yearId: yearDivisionId.yearId
  })

  const sides = getSidesCapitalized()
  let stats = {}

  for (const league of leagueTable) {
    for (const side of sides) {
      const teamSlug = league[`team${side}Slug`]
      if (!(teamSlug in stats)) {
        stats[teamSlug] = {
          team: {
            name: league[`team${side}Name`],
            slug: teamSlug
          },
          won: 0,
          draw: 0,
          loss: 0,
          played: 0,
          points: 0
        }
      }
      const score = parseInt(league[`score${side}`])
      const opposingScore = parseInt(league[`score${getOtherSideCapitalized(side)}`])
      stats[teamSlug].played++
      stats[teamSlug].points += score
      if (score === opposingScore) {
        stats[teamSlug].draw++
      } else if (score > opposingScore) {
        stats[teamSlug].won++
      } else {
        stats[teamSlug].loss++
      }
    }
  }

  // sort stats by points
  stats = Object.values(stats).sort((a, b) => {
    if (a.points === b.points) {
      return a.played - b.played
    }
    return b.points - a.points
  })

  return NextResponse.json({
    stats
  }, { status: 200 })
}
