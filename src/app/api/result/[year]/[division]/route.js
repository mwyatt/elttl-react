import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { getYearDivisionId } from '@/app/lib/year'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { year, division } = await params

  const yearDivisionId = await getYearDivisionId(year, division)

  if (!yearDivisionId) {
    return NextResponse.json(`Unable to find division with year name '${year}' and slug '${division}'`, { status: StatusCodes.NOT_FOUND })
  }

  const [teams] = await connection.execute(`
      SELECT tt.id,
             tt.name,
             tt.slug,
             tv.name                                   venueName,
             tv.slug                                   venueSlug,
             tp.slug                                   secretarySlug,
             concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
             tp.phoneLandline                          secretaryPhoneLandline,
             tp.phoneMobile                            secretaryPhoneMobile
      FROM tennisTeam tt
               LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = tt.yearId
               LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
      WHERE tt.yearId = :yearId
        AND tt.divisionId = :divisionId
  `, {
    divisionId: yearDivisionId.divisionId,
    yearId: yearDivisionId.yearId
  })

  const [leagueTable] = await connection.execute(`
      select ttl.name        teamLeftName,
             ttl.slug        teamLeftSlug,
             sum(scoreLeft)  scoreLeft,
             ttr.name        teamRightName,
             ttr.slug        teamRightSlug,
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

  const teamIdsQuery = teams.map(team => team.id).join(',')

  const [fulfilledFixtures] = await connection.execute(`
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
          and ttf.teamIdLeft in (${teamIdsQuery})
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = :yearId
        and status != 'exclude'
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId: yearDivisionId.yearId,
  })

  const [unfulfillfedFixtures] = await connection.execute(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             '0'      scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
             '0'      scoreRight,
             timeFulfilled
      from tennisFixture ttf
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
      where ttf.yearId = :yearId
        and ttf.teamIdLeft in (${teamIdsQuery})
        and ttf.timeFulfilled is null
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `, {
    yearId: yearDivisionId.yearId,
  })

  return NextResponse.json({
    leagueTable,
    teams,
    fulfilledFixtures,
    unfulfillfedFixtures
  }, { status: StatusCodes.OK })
}
