import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from "@/components/Breadcrumbs";
import {linkStyles} from "@/lib/styles";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/team/${slug}`)
  const { team, players } = await response.json()
console.log(players)
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

      <div className={'flex gap-8'}>
        <div className={'flex-1'}>

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
              {team.homeWeekday}
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
        </div>
        <div className={'flex-1'}>
      <SubHeading name='Registered Players' />
      <div className='flex flex-wrap'>

        {players.map((player) => (
          <Link
            href={`/result/${year}/player/${player.slug}`}
            className='m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'
            key={player.slug}
          >
            <span className='float-right text-gray-500 text-sm'>{player.rank}</span>
            <div>{player.name}</div>
          </Link>
        ))}

      </div>

        </div>
      </div>


    </FrontLayout>
  )
}
