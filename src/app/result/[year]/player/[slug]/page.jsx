import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import FixtureCard from '@/components/FixtureCard'
import { apiUrl } from '@/constants/url'
import SubHeading from '@/components/SubHeading'
import RankChange from '@/components/player/RankChange'
import MainHeading from '@/components/MainHeading'
import { linkStyles } from '@/lib/styles'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

export async function generateMetadata (
  { params }
) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/player/${slug}`)
  const { player } = await response.json()

  return {
    title: getMetaTitle(`Player ${player.name}`),
    description: `Summary and statistics for player ${player.name}`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, slug } = await params
  const { player, encounters, fixtures } = await fetchJson(`/result/${year}/player/${slug}`)

  const getPlayerLink = (playerSlug, playerName) => {
    if (playerSlug === slug) {
      return <span className='text-tertiary-500'>{playerName}</span>
    }
    return (
      <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${playerSlug}`}>
        {playerName}
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
            { name: player.name }
          ]
        }
      />

      <MainHeading name={player.name} />
      <div className='lg:flex gap-16'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <p>Plays for the <Link className={linkStyles.join(' ')} href={`/result/${year}/team/${player.teamSlug}`}>{player.teamName}</Link> team with a rank of <span className='font-bold'>{player.rank}</span> and has had <span className='font-bold'>{encounters.length}</span> encounters with other players so far this season.</p>

          {/* @todo make this only fixtures that the player has been involved in */}
          <SubHeading name='Team Fixtures' />
          <div className='flex flex-wrap gap-3'>

            {fixtures.map((fixture, index) => (
              <FixtureCard
                key={index}
                year={year}
                teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
                teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
                timeFulfilled={fixture.timeFulfilled}
              />
            ))}

          </div>
        </div>

        <div className='flex-1'>

          <SubHeading name='Season Performance' />

          {encounters.map((encounter, index) => (
            <div key={index} className='flex p-4 gap-4 border-t border-dashed hover:bg-gray-100'>
              <div className='flex-2'>
                {getPlayerLink(encounter.playerLeftSlug, encounter.playerLeftName)}
                <RankChange rankChange={encounter.playerRankChangeLeft} />
              </div>
              <div className='flex-1 text-right'>{encounter.scoreLeft}</div>
              <div className='flex-1'>{encounter.scoreRight}</div>
              <div className='flex-2'>
                <RankChange rankChange={encounter.playerRankChangeRight} />
                {getPlayerLink(encounter.playerRightSlug, encounter.playerRightName)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </FrontLayout>
  )
}
