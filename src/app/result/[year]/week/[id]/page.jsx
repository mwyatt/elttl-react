import FrontLayout from '@/app/frontLayout'
import Address from '@/components/Address'
import DirectionsButton from '@/components/DirectionsButton'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'
import { WeekTypeLabels, WeekTypes } from '@/constants/Week'
import { fetchJson } from '@/app/lib/fetchWrapper'
import dayjs from 'dayjs'
import classNames from 'classnames'
import FixtureCard from '@/components/FixtureCard'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, id } = (await params)
  const {
    week,
    fixtures
  } = await fetchJson(`/result/${year}/week/${id}`)

  return (
    <FrontLayout maxWidth>
        <Breadcrumbs items={
          [
            { name: 'Season', href: `/result/${year}/season` },
            { name: 'Week' }
          ]
        }
        />

      <MainHeading name={`Week ${week.timeStart}`}/>
      <p className={'mb-12'}>This is what is happening this week:</p>

      {week.type === WeekTypes.fixture && (
        <>
        <p className={'mb-8'}>The following fixtures are scheduled to be played:</p>
          <div className={'grid gap-6 md:grid-cols-6'}>

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
        </>
      )}
    </FrontLayout>
  )
}
