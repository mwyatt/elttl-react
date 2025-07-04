'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import { homeNightMap } from '@/constants/Team'
import { getTodaysVenueSessions } from '@/constants/VenueSessions'
import { linkStyles } from '@/lib/styles'

export default function SessionsToday ({ yearName }) {
  const todayVenueSessions = getTodaysVenueSessions()

  return (
    <div className={'my-6 px-4 md:px-0'}>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>{homeNightMap[dayjs().day()]}s Sessions</h2>
        <Link className='text-gray-500 border-b border-b-gray-400' href='/sessions'>All Sessions</Link>
      </div>
      <div className='flex flex-wrap gap-3 mb-6'>
        {todayVenueSessions.map((session) => (
          <div key={session.venue.id}>
            <h3 className='text-lg mb-2'>
            <Link href={`/result/${yearName}/venue/${session.venue.slug}`} className={linkStyles.join(' ')}>
              {session.venue.name}
            </Link>
            </h3>
                            <ul className='list-disc list-inside pl-5'>
                  {session.times.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
