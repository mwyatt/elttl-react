import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { linkStyles } from '@/lib/styles'
import FixtureCard from '@/components/FixtureCard'
import { homeNightMap } from '@/constants/Team'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/team/${slug}`)
  const { team, players, fixtures } = await response.json()

  return (
    <FrontLayout>
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

      <div className='flex gap-8'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <table className='w-full border border-stone-500'>
            <tbody>
              <tr>
                <th className='p-3 border border-stone-500 bg-stone-400'>Division</th>
                <td className='p-3 border border-stone-500'>
                  <Link className={linkStyles.join(' ')} href={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</Link>
                </td>
              </tr>
              <tr>
                <th className='p-3 border border-stone-500 bg-stone-400'>Home Night</th>
                <td className='p-3 border border-stone-500'>
                  {homeNightMap[team.homeWeekday]}
                </td>
              </tr>
              <tr>
                <th className='p-3 border border-stone-500 bg-stone-400'>Venue</th>
                <td className='p-3 border border-stone-500'>
                  <Link className={linkStyles.join(' ')} href={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</Link>
                </td>
              </tr>
              <tr>
                <th className='p-3 border border-stone-500 bg-stone-400'>Secretary</th>
                <td className='p-3 border border-stone-500'>
                  <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</Link>
                </td>
              </tr>
            </tbody>
          </table>

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
          <SubHeading name='Registered Players' />
          <div className=''>

            {players.map((player, index) => (
              <div key={index} className='flex p-4 gap-4 border-t border-dashed hover:bg-gray-100'>
                <div className='flex-2'>
                  <Link
                    href={`/result/${year}/player/${player.slug}`}
                    className={linkStyles.join(' ')}
                    key={player.slug}
                  >
                    {player.name}
                  </Link>
                </div>
                <div className='flex-1 text-right'>
                  <span className='float-right text-gray-500 text-sm'>{player.rank}</span>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

    </FrontLayout>
  )
}
