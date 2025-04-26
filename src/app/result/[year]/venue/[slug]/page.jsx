import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import { apiUrl } from '@/constants/url'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/venue/${slug}`)
  const data = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: data.venue.name, href: `/result/${year}/venue/${data.venue.name}` }
          ]
        }
      />

      <MainHeading name={data.venue.name} />
      <p>{data.venue.location}</p>

      <SubHeading name='Teams Playing Here' />
      <div className='flex flex-wrap'>

        {data.teams.map((team) => (
          <Link
            href={`/result/${year}/team/${team.slug}`}
            className='m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'
            key={team.slug}
          >
            <span className='float-right text-gray-500 text-sm'>{team.divisionName}</span>
            <div>{team.name}</div>
          </Link>
        ))}

      </div>
    </FrontLayout>
  )
}
