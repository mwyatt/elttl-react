import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import RankChange from '@/components/player/RankChange'
import { apiUrl } from '@/constants/url'
import encounterStatus from '@/constants/EncounterStatus'
import { linkStyles } from '@/lib/styles'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const teamLeftSlug = (await params).teamLeftSlug
  const teamRightSlug = (await params).teamRightSlug

  const response = await fetch(`${apiUrl}/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`)
  const {
    teamLeft,
    teamRight,
    venue,
    encounters
  } = await response.json()

  const getPlayerLink = (playerSlug, playerName, status) => {
    if (status === encounterStatus.DOUBLES) {
      return 'Doubles'
    }
    if (!playerSlug) {
      return <span className='text-gray-500 line-through'>Absent Player</span>
    }
    return (
      <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${playerSlug}`}>
        {playerName || 'Unknown Player'}
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
              <div className='basis-1/4'>
                {getPlayerLink(row.playerLeftSlug, row.playerLeftName, row.status)}
                <RankChange rankChange={row.playerRankChangeLeft} />
              </div>
              <div className='basis-1/4 font-bold text-right text-xl pr-4 border-r'>{row.scoreLeft}</div>
              {/* <div className='basis-1/4 font-bold text-right text-xl'>-</div> */}
              <div className='basis-1/4 font-bold text-xl pl-2'>{row.scoreRight}</div>
              <div className='basis-1/4'>
                {getPlayerLink(row.playerRightSlug, row.playerRightName, row.status)}
                <RankChange rankChange={row.playerRankChangeRight} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FrontLayout>
  )
}
