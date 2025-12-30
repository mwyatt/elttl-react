import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import FixtureCard from '@/components/FixtureCard'
import { apiUrl } from '@/constants/url'
import SubHeading from '@/components/SubHeading'
import RankChange from '@/components/player/RankChange'
import MainHeading from '@/components/MainHeading'
import { linkStyles } from '@/lib/styles'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'
import { getShortPlayerName } from '@/lib/player'

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
      return (
        <>
                <span className='sm:hidden text-tertiary-500'>{getShortPlayerName(playerName)}</span>
        <span className='hidden sm:inline text-tertiary-500'>{playerName}</span>
          </>
        )
    }
    return (
      <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/player/${playerSlug}`}>
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
            { name: player.name }
          ]
        }
      />

      <MainHeading name={player.name} />
      <div className='lg:flex gap-16'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <p>Plays for the <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/team/${player.teamSlug}`}>{player.teamName}</GeneralLink> team with a rank of <span className='font-bold'>{player.rank}</span> and has had <span className='font-bold'>{encounters.length}</span> encounters with other players so far this season.</p>

          {(player.phoneLandline || player.phoneMobile) && (
            <>
            <SubHeading name='Contact Information' />
            {player.phoneLandline && (
              <p className='mb-2'>Phone Landline: <a className='text-primary-500' href={`tel:${player.phoneLandline}`}>{player.phoneLandline}</a></p>
            )}
            {player.phoneMobile && (
              <p className='mb-2'>Phone Mobile: <a className='text-primary-500' href={`tel:${player.phoneMobile}`}>{player.phoneMobile}</a></p>
            )}
            </>
          )}

          {/* @todo make this only fixtures that the player has been involved in */}
          <SubHeading name='Team Fixtures' />
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3 '>

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

          <div className={'grid grid-cols-10'}>

          {encounters.map((encounter, index) => (
            <div key={index} className={'contents'}>
              <div className='col-span-4 pt-3 border-t border-dashed border-t-stone-300 pb-3'>
                {getPlayerLink(encounter.playerLeftSlug, encounter.playerLeftName)}
                <RankChange rankChange={encounter.playerRankChangeLeft} />
              </div>
              <div className=' text-right pt-3 border-t border-dashed border-t-stone-300 pb-3 pr-2'>{encounter.scoreLeft}</div>
              <div className=' pt-3 border-t border-dashed border-t-stone-300 pb-3 pl-2'>{encounter.scoreRight}</div>
              <div className='col-span-4  pt-3 border-t border-dashed border-t-stone-300 pb-3 text-right'>
                <RankChange rankChange={encounter.playerRankChangeRight} />
                {getPlayerLink(encounter.playerRightSlug, encounter.playerRightName)}
              </div>
              </div>
          ))}
          </div>

        </div>
      </div>

    </FrontLayout>
  )
}
