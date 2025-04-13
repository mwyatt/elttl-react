import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import MainHeading from "@/components/MainHeading";
import SubHeading from "@/components/SubHeading";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/team/${slug}`)
  const { team, players } = await response.json()

  return (
    <FrontLayout>
      <MainHeading name={team.name} />

            <SubHeading name={'General Information'} />
      <table className={'w-full border border-stone-500'}>
        <tbody>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Division</th>
            <td className={'p-3 border border-stone-500'}>
              <Link href={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</Link>
            </td>
          </tr>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Home Night</th>
            <td className={'p-3 border border-stone-500'}>
              {team.homeWeekday}
            </td>
          </tr>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Venue</th>
            <td className={'p-3 border border-stone-500'}>
              <Link href={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</Link>
            </td>
          </tr>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Secretary</th>
            <td className={'p-3 border border-stone-500'}>
              <Link href={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</Link>
            </td>
          </tr>
        </tbody>
      </table>

            <SubHeading name={'Registered Players'} />
      <div className='flex flex-wrap'>

        {players.map((player) => (
          <Link
            href={`/result/${year}/player/${player.slug}`}
            className='m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'
            key={player.slug}
          >
            <span className='float-right text-gray-500 text-sm'>{player.divisionName}</span>
            <div>{player.name}</div>
          </Link>
        ))}

      </div>
    </FrontLayout>
  )
}
