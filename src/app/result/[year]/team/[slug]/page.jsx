import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { linkStyles } from '@/lib/styles'
import FixtureCard from '@/components/FixtureCard'
import { homeNightMap } from '@/constants/Team'
import { apiUrl } from '@/constants/url'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'
import WeeksTimeline from '@/components/WeeksTimeline'

export async function generateMetadata (
  { params }
) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/team/${slug}`)
  const { team } = await response.json()

  return {
    title: getMetaTitle(`Team ${team.name}`),
    description: `Summary and statistics for team ${team.name}`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, slug } = await params
  const { team, players, fixtures, weeks } = await fetchJson(`/result/${year}/team/${slug}`)

  return (
    <FrontLayout visitingYearName={year}>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: team.name }
          ]
        }
      />

      <MainHeading name={team.name} />

      <div className='md:flex gap-8'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <p className='my-2'>Team in the <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</GeneralLink> division playing at the <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</GeneralLink> venue on a <strong>{homeNightMap[team.homeWeekday]}</strong> night.</p>

          {team.secretaryName && (
            <p>Secretary is <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</GeneralLink></p>
          )}
          {!team.secretaryName && (
            <p>There is no team secretary currently.</p>
          )}

          {weeks.length > 0 && (
            <WeeksTimeline yearName={year} weeks={weeks} teamSlug={team.slug} />
          )}

        </div>
        <div className='flex-1'>
          <SubHeading name='Registered Players' />
          <div className=''>

            {players.map((player, index) => (
              <div key={index} className='flex p-4 gap-4 border-t border-dashed hover:bg-gray-100'>
                <div className='flex-2'>
                  <GeneralLink
                    href={`/result/${year}/player/${player.slug}`}
                    className={linkStyles.join(' ')}
                    key={player.slug}
                  >
                    {player.name}
                  </GeneralLink>
                </div>
                <div className='flex-1 text-right'>
                  <span className='float-right text-tertiary-500'>{player.rank}</span>
                </div>
              </div>
            ))}

          </div>

          {/* <SubHeading name='Directions' /> */}
          {/* <DirectionsButton url={data.venue.location} /> */}

          <SubHeading name='Fixtures Fulfilled' />
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
      </div>

    </FrontLayout>
  )
}
