import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import { NonEventTypes, WeekTypeLabels, WeekTypes } from '@/constants/Week'
import { fetchJson } from '@/app/lib/fetchWrapper'
import classNames from 'classnames'
import { formatDayWithSuffixOfMonth, isCurrentWeek } from '@/lib/date'
import { linkStyles } from '@/lib/styles'
import { getWeekDate } from '@/lib/week'
import { BiTrophy } from 'react-icons/bi'

export const dynamic = 'force-dynamic'

const Week = ({ yearName, week }) => {
  const currentWeek = isCurrentWeek(week.timeStart)
  const formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(week.type, week.timeStart)
  )
  const isEvent = NonEventTypes.includes(week.type) === false

  return (
    <div className={classNames({
      'border rounded': true,
      'border-primary-500': currentWeek,
      'overflow-hidden': true,
      'flex flex-col': true,
      'border-2': isEvent || currentWeek,
      'border-b-primary-500': isEvent,
      hidden: week.type === WeekTypes.nothing
    })}
    >
      <p className='p-2 text-center bg-stone-100'>{formattedDate}</p>
      <div className='p-4 flex flex-col gap-4 flex-grow'>
        <h2 className='text-2xl flex-grow'>
          {isEvent && (
            <BiTrophy className='inline mr-1 mb-1 fill-primary-500' size={24} />
          )}
          {WeekTypeLabels[week.type]}
        </h2>
        <div className='flex justify-end'>
          {week.type !== WeekTypes.nothing && (
            <GeneralLink
              className={linkStyles.join(' ')}
              href={`/result/${yearName}/week/${week.id}`}
            >View
            </GeneralLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Page ({ params }) {
  const year = (await params).year
  const {
    weeks
  } = await fetchJson(`/result/${year}/season`)

  return (
    <FrontLayout visitingYearName={year} maxWidth>
      <Breadcrumbs
        items={
          [
            { name: 'Season' }
          ]
        }
      />

      <MainHeading name='Season Overview' />
      <p className='mb-12'>This is an overview of what is happening in the {year} season:</p>

      {weeks.length === 0 && (
        <p>No weeks have been configured yet.</p>
      )}
      {weeks.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>

          {weeks.map((week) => <Week key={week.id} yearName={year} week={week} />)}

        </div>
      )}
    </FrontLayout>
  )
}
