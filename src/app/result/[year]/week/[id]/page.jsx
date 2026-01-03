import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'
import { ExactDayWeekTypes, FredHoldenCupWeekTypes, getWeekTypeLabel, WeekTypes } from '@/constants/Week'
import { fetchJson } from '@/app/lib/fetchWrapper'
import FixtureCard from '@/components/FixtureCard'
import { formatDayWithSuffixOfMonth } from '@/lib/date'
import {
  AnnualClosedCompetitionContent,
  DivisionalHandicapCompetitionContent,
  FredHoldenCupCompetitionContent,
  VetsCompetitionContent
} from '@/components/CompetitionsContent'
import DatePretty from '@/components/DatePretty'
import { getWeekDate } from '@/lib/week'

export const dynamic = 'force-dynamic'

const getHeading = (weekType, weekTimeStart) => {
  const weekTypeLabel = getWeekTypeLabel(weekType)
  const formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(weekType, weekTimeStart)
  )
  let middleBit = ' Week Commencing '

  if (ExactDayWeekTypes.includes(weekType)) {
    middleBit = ' on '
  } else if (weekType === WeekTypes.catchup) {
    middleBit = ' Commencing '
  }

  return `${weekTypeLabel}${middleBit}${formattedDate}`
}

export default async function Page ({ params }) {
  const { year, id } = (await params)
  const {
    week,
    fixturesByDivisionName,
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

      <MainHeading name={getHeading(week.type, week.timeStart)} />

      {week.type === WeekTypes.nothing && (
        <p className='mb-12'>Nothing has been scheduled for this week.</p>
      )}
      {week.type === WeekTypes.vets && (
        <VetsCompetitionContent />
      )}
      {week.type === WeekTypes.fixture && (
        <>
          <p className='mb-12'>This week, the following {fixturesByDivisionName.length} fixtures are scheduled to be played:</p>

          {Object.entries(fixturesByDivisionName).map(([divisionName, fixtures]) => (
            <div key={divisionName}>
              <SubHeading name={`${divisionName} Division`} />
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
            </div>
          ))}

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
          <p className='my-4'>
            The Annual Presentation is usually held at Accrington Golf Club, Oswaldtwistle from 7.00 for 7.30 pm. Juniors pay half price for the meal. There will be a vegetarian option.
          </p>
          <p className='my-4'>
            Please support this event and celebrate with the winners of the various competition run throughout the year.
          </p>
          <p className='my-4'>
            It might be your turn next year.
          </p>
        </>
      )}
      {week.type === WeekTypes.agm && (
        <>
          <p className='my-4'>The AGM of the East Lancashire Table Tennis League is to be held at The Hyndburn Leisure Centre from 7.30 pm. onwards.</p>
          <p className='my-4'>All players are welcome to this meeting. Officers will be elected and rule changes can be made to facilitate the effective running of the League.<br />It is important to note that rule changes, amendments must be forwarded to the Secretary before April.</p>
        </>
      )}
      {week.type === WeekTypes.catchup && (
        <>
          <p className='my-4'>
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
      {week.type === WeekTypes.closedCompetition && (
        <AnnualClosedCompetitionContent />
      )}

    </FrontLayout>
  )
}
