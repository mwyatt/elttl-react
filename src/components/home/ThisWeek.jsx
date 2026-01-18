'use client'

import GeneralLink from '@/components/GeneralLink'
import { allHomeButtonStyles } from '@/lib/styles'

export default function ThisWeek ({ yearName, week, fixtures = [] }) {
  return (
    <div className='grow flex flex-col gap-4 h-full'>
      <div className='flex w-full justify-end'>
        <h2 className='text-2xl grow'>This Week</h2>
        <GeneralLink className={allHomeButtonStyles} href={`/result/${yearName}/season`}>Season Overview</GeneralLink>
      </div>
      <div className='grow flex items-center text-center'>
        {fixtures.length > 0 && (
          <p className='mt-2 text-2xl'>{fixtures.length} fixture{fixtures.length > 1 ? 's' : ''} are scheduled to be played this week.</p>
        )}
      </div>
      <div className='flex justify-end'>
        <GeneralLink href={`/result/${yearName}/week/${week.id}`} className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg'>View Week</GeneralLink>
      </div>
    </div>
  )
}
