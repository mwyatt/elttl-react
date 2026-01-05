import classNames from 'classnames'
import Week from '@/components/Week'
import { getClosestWeekId } from '@/lib/date'

export default function WeeksTimeline ({ yearName, weeks, teamSlug }) {
  const closestWeekId = getClosestWeekId(weeks)

  return (
    <div className={classNames({
      'grid gap-y-0': true
    })}
    >
      {weeks.map((week) => <Week key={week.id} yearName={yearName} week={week} teamSlug={teamSlug} closestWeekId={closestWeekId} />)}
    </div>
  )
}
