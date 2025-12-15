import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import RankChange from '@/components/player/RankChange'
import { apiUrl } from '@/constants/url'
import { linkStyles } from '@/lib/styles'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getShortPlayerName } from '@/lib/player'
import { getMetaTitle } from '@/constants/MetaData'
import { getSideCapitalized, scorecardStructure, SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'
import { fetchJson } from '@/app/lib/fetchWrapper'
import SubHeading from '@/components/SubHeading'
import FixtureEncounterChart from '@/app/result/[year]/fixture/[teamLeftSlug]/[teamRightSlug]/FixtureEncounterChart'
import EncounterStatus from '@/constants/EncounterStatus'
import classNames from 'classnames'

export async function generateMetadata (
  { params }
) {
  const { year, teamLeftSlug, teamRightSlug } = (await params)

  const response = await fetch(`${apiUrl}/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`)
  const {
    teamLeft,
    teamRight
  } = await response.json()

  return {
    title: getMetaTitle(`Fixture ${teamLeft.name} vs ${teamRight.name}`),
    description: `Final fixture score between ${teamLeft.name} and ${teamRight.name} in the ${year} season.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, teamLeftSlug, teamRightSlug } = (await params)
  const {
    teamLeft,
    teamRight,
    venue,
    encounters
  } = await fetchJson(`/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`)
  const fixtureFulfilled = encounters.length > 0

  const getGrandTotal = (side) => {
    const sideCapitalized = getSideCapitalized(side)
    const sideScoreKey = `score${sideCapitalized}`
    let score = 0

    encounters.forEach((encounter) => {
      if (encounter.status === EncounterStatus.EXCLUDE) {
        return
      }
      score += parseInt(encounter[sideScoreKey])
    })

    return score
  }

  const getPlayerLink = (playerSlug, playerName, status, isAwayPlayer = false) => {
    if (status === EncounterStatus.DOUBLES) {
      return ''
    }
    if (!playerSlug) {
      return <span className='text-gray-500 line-through'>Absent<span className='hidden sm:inline'> Player</span></span>
    }
    return (
      <GeneralLink
        className={[
          linkStyles.join(' '),
          isAwayPlayer ? 'text-tertiary-500 border-b-tertiary-500' : ''
        ].join(' ')} href={`/result/${year}/player/${playerSlug}`}
      >
        <span className='sm:hidden'>{getShortPlayerName(playerName)}</span>
        <span className='hidden sm:inline'>{playerName}</span>
      </GeneralLink>
    )
  }

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: `${teamLeft.name} vs ${teamRight.name}` }
          ]
        }
      />

      <div className='max-w-[768px] mx-auto'>
        <MainHeading name={`${teamLeft.name} vs ${teamRight.name}`} />
        <p className='mb-8'>
          Home team venue
          {' '}
          <GeneralLink
            className={linkStyles.join(' ')}
            href={`/result/${year}/venue/${venue.slug}`}
          >{venue.name}
          </GeneralLink>
        </p>
        {!fixtureFulfilled && (
          <p>Fixture has not yet been fulfilled, please check back later.</p>
        )}
        {encounters.map((row, index) => (
          <div key={index} className='flex gap-4 mt-4 border-b border-dashed border-gray-300 pb-3'>
            <div className='w-2/6'>
              <span className={classNames({
                'max-md:hidden': scorecardStructure[index][0] !== EncounterStatus.DOUBLES,
                'mr-4': true
              })}
              >
                {scorecardStructure[index][0] === EncounterStatus.DOUBLES
                  ? 'Doubles'
                  : (
                    <>{scorecardStructure[index][0]} v {scorecardStructure[index][1]}</>
                    )}
              </span>

              {getPlayerLink(row.playerLeftSlug, row.playerLeftName, row.status)}
              <RankChange rankChange={row.playerRankChangeLeft} />
            </div>
            <div className='w-1/6 flex-grow font-bold text-right text-xl pr-4 border-r'>{row.scoreLeft}</div>
            <div className='w-1/6 flex-grow font-bold text-xl pl-2'>{row.scoreRight}</div>
            <div className='w-2/6 text-right'>
              <RankChange rankChange={row.playerRankChangeRight} />
              {getPlayerLink(row.playerRightSlug, row.playerRightName, row.status, true)}
            </div>
          </div>
        ))}
        {fixtureFulfilled && (
          <div className='text-4xl flex p-6 mb-6 gap-10 bg-white rounded-bl rounded-br border border-dashed border-stone-300 border-t-0'>
            <div className='w-1/2 text-right'>{getGrandTotal(SIDE_LEFT)}</div>
            <div className='w-1/2 '>{getGrandTotal(SIDE_RIGHT)}</div>
          </div>
        )}

        <SubHeading name='Performance' />
        <FixtureEncounterChart year={year} teamLeftName={teamLeft.name} teamRightName={teamRight.name} encounters={encounters} />
      </div>
    </FrontLayout>
  )
}
