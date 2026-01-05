import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import Breadcrumbs from '@/components/Breadcrumbs'
import { fetchJson } from '@/app/lib/fetchWrapper'
import SubHeading from '@/components/SubHeading'
import InformationTable from '@/components/team/InformationTable'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const { divisions, teamsByDivisionId } = await fetchJson(`/result/${year}`)

  return (
    <FrontLayout visitingYearName={year}>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` }
          ]
        }
      />
      <h2 className='text-2xl mb-4'>Season {year}</h2>
      <p>Here are all the divisions in this season. To view all the fixtures for each division, please click the division links below.</p>
      <div className='flex gap-4 mt-8 flex-wrap'>
        {divisions.map((division) => (
          <GeneralLink className='px-6 py-3 border border-primary-500 rounded font-bold' href={`/result/${year}/${division.name.toLowerCase()}`} key={division.name}>
            {division.name} Division
          </GeneralLink>
        ))}
      </div>

      {divisions.map((division) => (
        <div key={division.id}>
          <SubHeading name={`${division.name} Division`} />
          <InformationTable yearName={year} teams={teamsByDivisionId[division.id]} key={division.name} />
        </div>
      ))}

    </FrontLayout>
  )
}
