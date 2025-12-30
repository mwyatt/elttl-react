'use client'

import GeneralLink from '@/components/GeneralLink'
import { allHomeButtonStyles } from '@/lib/styles'

export default function ThisWeek ({ yearName }) {
  // const date = dayjs()

  return (
    <div className='my-6 px-4 md:px-0'>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>Week beginning DATE</h2>
        <GeneralLink className={allHomeButtonStyles} href={`/result/${yearName}/season`}>Season Schedule</GeneralLink>
      </div>
      <div className='flex flex-wrap gap-3 mb-6' />
    </div>
  )
}
