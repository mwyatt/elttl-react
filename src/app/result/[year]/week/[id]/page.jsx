import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'
import { FredHoldenCupWeekTypes, getWeekTypeLabel, WeekTypes } from '@/constants/Week'
import { fetchJson } from '@/app/lib/fetchWrapper'
import FixtureCard from '@/components/FixtureCard'
import { formatDayWithSuffixOfMonth } from '@/lib/date'
import {
  DivisionalHandicapCompetitionContent,
  FredHoldenCupCompetitionContent,
  VetsCompetitionContent
} from '@/components/CompetitionsContent'
import DatePretty from '@/components/DatePretty'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, id } = (await params)
  const {
    week,
    fixtures,
    fredHoldenCupPress,
    unfulfilledFixtures
  } = await fetchJson(`/result/${year}/week/${id}`)
  const weekTypeLabel = getWeekTypeLabel(week.type)

  return (
    <FrontLayout maxWidth>
      <Breadcrumbs items={
          [
            { name: 'Season', href: `/result/${year}/season` },
            { name: `Week - ${weekTypeLabel}` }
          ]
        }
      />

      <MainHeading name={`Week Commencing ${formatDayWithSuffixOfMonth(week.timeStart)}`} />
      <SubHeading name={weekTypeLabel} />

      {week.type === WeekTypes.nothing && (
        <p className='mb-12'>Nothing has been scheduled for this week.</p>
      )}
      {week.type === WeekTypes.vets && (
        <VetsCompetitionContent />
      )}
      {week.type === WeekTypes.fixture && (
        <>
          <p className='mb-12'>This week, the following {fixtures.length} fixtures are scheduled to be played:</p>
          <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>

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
      {FredHoldenCupWeekTypes.includes(week.type) && (
        <>
          <FredHoldenCupCompetitionContent />
          {fredHoldenCupPress.length > 0 && (
            <>
              <h3 className='text-lg font-semibold mb-3 mt-5'>Related Press</h3>
              <div className='space-y-4'>
                {fredHoldenCupPress.map((content, index) => (
                  <div className='p-4 border-b' key={index}>
                    <p className='text-sm text-gray-500 mb-2'>
                      <DatePretty time={content.timePublished} />
                    </p>
                    <h2><GeneralLink className={linkStyles.join(' ')} href={`/press/${content.slug}`}>{content.title}</GeneralLink></h2>
                    <h3 className='mt-2'>{content.author}</h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      {week.type === WeekTypes.div && (
        <DivisionalHandicapCompetitionContent />
      )}
      {week.type === WeekTypes.presentation && (
        <>
          <p className='my-6'>
            @todo information about the presentation night
          </p>
        </>
      )}
      {week.type === WeekTypes.agm && (
        <>
          <p className='my-6'>
            @todo information about the AGM
          </p>
        </>
      )}
      {week.type === WeekTypes.catchup && (
        <>
          <p className='my-6'>
            This week teams will have the opportunity to play any fixtures they may have missed earlier in the season. Here are the currently outstanding fixtures to be played:
          </p>
          {unfulfilledFixtures.length > 0 && (
            <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>

              {unfulfilledFixtures.map((fixture, index) => (
                <FixtureCard
                  key={index}
                  year={year}
                  teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
                  teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
                  timeFulfilled={fixture.timeFulfilled}
                />
              ))}
            </div>
          )}

        </>
      )}

    </FrontLayout>
  )
}
