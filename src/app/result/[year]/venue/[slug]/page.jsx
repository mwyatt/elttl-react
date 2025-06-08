import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import { apiUrl } from '@/constants/url'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import { BiMap } from 'react-icons/bi'
import DirectionsButton from '@/components/DirectionsButton'
import { getMetaTitle } from '@/constants/MetaData'

export async function generateMetadata (
  { params }
) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/venue/${slug}`)
  const { venue } = await response.json()

  return {
    title: getMetaTitle(`Venue ${venue.name}`),
    description: `Who plays at the ${venue.name} venue and how to get there.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/venue/${slug}`)
  const { teams, venue } = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: venue.name }
          ]
        }
      />

      <MainHeading name={venue.name} />

      <div className='sm:flex gap-16'>

        <div className='flex-1'>

          <SubHeading name='Teams Playing Here' />
          <div className='flex flex-wrap gap-3'>

            {teams.map((team) => (
              <Link
                href={`/result/${year}/team/${team.slug}`}
                className='p-4 border border-primary-500 text-primary-500 min-w-48 max-w-64 rounded grow basis-0'
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
          <DirectionsButton url={venue.location} />
        </div>

      </div>
    </FrontLayout>
  )
}
