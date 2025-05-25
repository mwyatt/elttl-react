'use client'

import Link from 'next/link'
import DatePretty from '@/components/DatePretty'

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled }) {
  return (
    <Link
      href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className='p-4 border-orange-500 border text-orange-500 w-64 rounded'
    >
      <span className={'flex'}>
        <span className='font-bold'>{teamLeft.name}</span>
        <span className={'ml-2 mr-1'}>{teamLeft.score}</span>
        <span className={'mr-2 ml-1'}>{teamRight.score}</span>
        <span className='font-bold'>{teamRight.name}</span>
      </span>
      <span className='text-stone-500 text-sm'>
        <DatePretty time={timeFulfilled} />
      </span>
    </Link>
  )
}
