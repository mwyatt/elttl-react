import classNames from 'classnames'
import Week from '@/components/Week'

export default function WeeksTimeline ({ yearName, weeks, teamSlug }) {
  return (
    <div className={classNames({
      'grid grid-cols-6 gap-4': true
    })}
    >
      {weeks.map((week) => <Week key={week.id} yearName={yearName} week={week} teamSlug={teamSlug} />)}
    </div>
  )
}
