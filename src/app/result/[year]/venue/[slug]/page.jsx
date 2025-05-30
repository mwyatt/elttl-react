import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import { apiUrl } from '@/constants/url'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { BiMap } from 'react-icons/bi'
import DirectionsButton from '@/components/DirectionsButton'

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
            { name: data.venue.name }
          ]
        }
      />

      <MainHeading name={data.venue.name} />

      <div className='sm:flex gap-16'>

        <div className='flex-1'>

          <SubHeading name='Teams Playing Here' />
          <div className='flex flex-wrap gap-3'>

            {data.teams.map((team) => (
              <Link
                href={`/result/${year}/team/${team.slug}`}
                className='p-4 border border-orange-500 text-orange-500 min-w-48 max-w-64 rounded grow basis-0'
                key={team.slug}
              >
                <span className='float-right text-gray-500 text-sm'>{team.divisionName}</span>
                <div>{team.name}</div>
              </Link>
            ))}
          </div>

        </div>
        <div className='flex-1'>
          <SubHeading name='Directions' />
          <DirectionsButton url={data.venue.location} />
        </div>

      </div>
    </FrontLayout>
  )
}
