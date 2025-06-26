import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import RankChange from '@/components/player/RankChange'
import { apiUrl } from '@/constants/url'
import encounterStatus from '@/constants/EncounterStatus'
import { linkStyles } from '@/lib/styles'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getShortPlayerName } from '@/lib/player'
import { getMetaTitle } from '@/constants/MetaData'
import { getSideCapitalized, SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'

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

  const response = await fetch(`${apiUrl}/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`)
  const {
    teamLeft,
    teamRight,
    venue,
    encounters
  } = await response.json()

  const getGrandTotal = (side) => {
    const sideCapitalized = getSideCapitalized(side)
    const sideScoreKey = `score${sideCapitalized}`
    let score = 0

    encounters.forEach((encounter) => {
      if (encounter.status === encounterStatus.EXCLUDE) {
        return
      }
      score += parseInt(encounter[sideScoreKey])
    })

    return score
  }

  const getPlayerLink = (playerSlug, playerName, status) => {
    if (status === encounterStatus.DOUBLES) {
      return 'Doubles'
    }
    if (!playerSlug) {
      return <span className='text-gray-500 line-through'>Absent<span className='hidden sm:inline'> Player</span></span>
    }
    return (
      <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${playerSlug}`}>

        <span className='sm:hidden'>{getShortPlayerName(playerName)}</span>
        <span className='hidden sm:inline'>{playerName}</span>

      </Link>
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
        <p className='mb-8'>Home team venue <Link className={linkStyles.join(' ')} href={`/result/${year}/venue/${venue.slug}`}>{venue.name}</Link></p>
        <div>
          {encounters.map((row, index) => (
            <div key={index} className='flex gap-2 mt-4 border-b border-dashed border-gray-300 pb-3'>
              <div className='w-1/3'>
                {getPlayerLink(row.playerLeftSlug, row.playerLeftName, row.status)}
                <RankChange rankChange={row.playerRankChangeLeft} />
              </div>
              <div className='flex-grow font-bold text-right text-xl pr-4 border-r'>{row.scoreLeft}</div>
              <div className='flex-grow font-bold text-xl pl-2'>{row.scoreRight}</div>
              <div className='w-1/3 text-right'>
                <RankChange rankChange={row.playerRankChangeRight} />
                {getPlayerLink(row.playerRightSlug, row.playerRightName, row.status)}
              </div>
            </div>
          ))}
        </div>
        <div className={'text-4xl flex mt-10 font-bold gap-6'}>
          <div className={'flex-1 text-right'}>{getGrandTotal(SIDE_LEFT)}</div>
          <div className={'flex-1 '}>{getGrandTotal(SIDE_RIGHT)}</div>
        </div>
      </div>
    </FrontLayout>
  )
}
