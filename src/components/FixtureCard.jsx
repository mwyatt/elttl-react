'use client'

import Link from 'next/link'
import DatePretty from '@/components/DatePretty'

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled }) {
  const getScoreClass = (score) => {

  }

  return (
    <Link
      href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className='flex-grow basis-0 px-4 pt-4 pb-4 border-orange-500 border text-orange-500 min-w-48 max-w-64 rounded'
    >
      <span className=''>
        <span className='text-stone-500 text-xs mb-1 block text-right'>
          <DatePretty time={timeFulfilled} />
        </span>
        <div className='flex'>
          <span className=' flex-grow'>{teamLeft.name}</span>
          <span className=''>{teamLeft.score}</span>
        </div>
        <div className='flex'>
          <span className=' flex-grow'>{teamRight.name}</span>
          <span className=''>{teamRight.score}</span>
        </div>
      </span>
    </Link>
  )
}
