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

export const dynamic = 'force-dynamic'

const getDayAfter = (timeStart) => {
  return dayjs.unix(timeStart).add(1, 'day')
}

function formatDayWithSuffixOfMonth (timeStart) {
  const day = getDayAfter(timeStart).date()
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || ~~(day % 100 / 10) === 1) ? 0 : day % 10]
  return `${day}${suffix} of ${dayjs.unix(timeStart).format('MMMM')}`
}

const isCurrentWeek = (weekTimeStart) => {
  const weekStart = dayjs.unix(weekTimeStart).startOf('week')
  const todayStart = dayjs().startOf('week')

  return weekStart.isSame(todayStart)
}

const Week = ({ yearName, week }) => {
  const currentWeek = isCurrentWeek(week.timeStart)

  return (
    <div className={classNames({
      'border rounded': true,
      'border-primary-500': currentWeek,
      'overflow-hidden': true,
    })}>
      <p className="p-2 text-center bg-stone-100">{formatDayWithSuffixOfMonth(week.timeStart)}</p>
      <div className={'p-4'}>
        <h2 className="text-2xl">{WeekTypeLabels[week.type]}</h2>
        <div className={'flex justify-end'}>
          {week.type !== WeekTypes.nothing && (
            <GeneralLink className={'bg-primary-500 rounded px-5 py-2 text-white font-bold mt-6'}
                         href={`/result/${yearName}/week/${week.id}`}>View</GeneralLink>
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
    <FrontLayout maxWidth>
      <Breadcrumbs
        items={
          [
            { name: 'Season' }
          ]
        }
      />

      <MainHeading name="Season Overview"/>
      <p className={'mb-12'}>This is an overview of what is happening each week in the {year} season:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

        {weeks.map((week) => <Week key={week.id} yearName={year} week={week}/>)}

      </div>

    </FrontLayout>
  )
}
