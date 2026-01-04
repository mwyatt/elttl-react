import { formatDateWithDayAndSuffixOfMonth, formatDayWithSuffixOfMonth, isCurrentWeek } from '@/lib/date'
import { getWeekDate } from '@/lib/week'
import { ExactDayWeekTypes, WeekTypeLabels, WeekTypes } from '@/constants/Week'
import classNames from 'classnames'
import { BiTrophy } from 'react-icons/bi'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import dayjs from 'dayjs'

export default function Week ({ yearName, week, teamSlug }) {
  const currentWeek = isCurrentWeek(week.timeStart)
  const isFixtureWeek = week.type === WeekTypes.fixture && week.fixtures.length > 0
  const isEvent = ExactDayWeekTypes.includes(week.type)
  const isAtHome = week.fixtures.some(fixture => fixture.teamLeftSlug === teamSlug)
  const isExactEventDate = ExactDayWeekTypes.includes(week.type) || isFixtureWeek
  let fixtureLink = ''
  let formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(week.type, week.timeStart)
  )

  if (isFixtureWeek) {
    const fixture = week.fixtures[0]
    fixtureLink = `/result/${yearName}/fixture/${fixture.teamLeftSlug}/${fixture.teamRightSlug}`
    formattedDate = formatDateWithDayAndSuffixOfMonth(
      dayjs.unix(week.timeStart).add(fixture.homeWeekday, 'day')
    )
  }

  if (isExactEventDate) {
    formattedDate = formatDateWithDayAndSuffixOfMonth(
      getWeekDate(week.type, week.timeStart)
    )
  }

  return (
    <div className={classNames({
      'contents border rounded': true,
      'border-primary-500': currentWeek,
      'border-2': isEvent || currentWeek,
      'border-b-primary-500': isEvent,
      hidden: week.type === WeekTypes.nothing
    })}
    >
      <div className='col-span-2'>
        <p
          className='p-2 text-center bg-stone-100 text-right border-r border-stone-300'
        >{!isExactEventDate && 'WC'} {formattedDate}
        </p>
      </div>
      <div className='col-span-4'>
        <h2 className='text-2xl flex-grow'>
          {isEvent && (
            <BiTrophy className='inline mr-1 mb-1 fill-primary-500' size={24} />
          )}
          {!isFixtureWeek && WeekTypeLabels[week.type]}
          {isFixtureWeek && week.fixtures.map((fixture, index) => {
            return (
              <div key={index}>
                {isAtHome && ('Home')}
                {!isAtHome && ('Away')}
                {' vs '}
                {isAtHome && (
                  <GeneralLink
                    className={linkStyles.join(' ')}
                    href={`/result/${yearName}/team/${fixture.teamRightSlug}`}
                  >
                    {fixture.teamRightName}
                  </GeneralLink>
                )}
                {!isAtHome && (
                  <GeneralLink
                    className={linkStyles.join(' ')}
                    href={`/result/${yearName}/team/${fixture.teamLeftSlug}`}
                  >{fixture.teamLeftName}
                  </GeneralLink>
                )}
                {' at '}
                <GeneralLink
                  className={linkStyles.join(' ')}
                  href={`/result/${yearName}/venue/${fixture.venueSlug}`}
                >{fixture.venueName}
                </GeneralLink>
              </div>
            )
          })}
        </h2>

        {week.type !== WeekTypes.nothing && (
          <GeneralLink
            className={linkStyles.join(' ')}
            href={`/result/${yearName}/week/${week.id}`}
          >View Week
          </GeneralLink>
        )}
        {isFixtureWeek && (
          <GeneralLink
            className={linkStyles.join(' ')}
            href={fixtureLink}
          >View Fixture
          </GeneralLink>
        )}
      </div>
    </div>
  )
}
