import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import { apiUrl } from '@/constants/url'
import MainHeading from '@/components/MainHeading'
import SubHeading from '@/components/SubHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import DirectionsButton from '@/components/DirectionsButton'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

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
  const { teams, venue } = await fetchJson(`/result/${year}/venue/${slug}`)

  return (
    <FrontLayout visitingYearName={year}>
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
          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-3'>

            {teams.map((team) => (
              <GeneralLink
                href={`/result/${year}/team/${team.slug}`}
                className='p-4 border border-primary-500 text-primary-500 rounded'
                key={team.slug}
              >
                <span className='float-right text-gray-500 text-sm'>{team.divisionName}</span>
                <div>{team.name}</div>
              </GeneralLink>
            ))}
          </div>

        </div>
        <div className='flex-1'>
          <SubHeading name='Directions' />

          <DirectionsButton url={venue.location} />
          <div className={`mt-16 p-4 bg-tertiary-500 text-white rounded bg-[url(/venue-${venue.slug}.jpg)] bg-cover bg-center bg-no-repeat flex-basis-1/3 md:basis-1/3 min-h-[175px]`} />

        </div>

      </div>
    </FrontLayout>
  )
}
