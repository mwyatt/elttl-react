'use client'

import Link from 'next/link'
import DatePretty from '@/components/DatePretty'

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled }) {
  return (
    <Link
      href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className='m-2 p-4 border bg-orange-500 text-white min-w-64 rounded'
    >
      <span className='float-right text-stone-300 text-sm'>
        <DatePretty time={timeFulfilled} />
      </span>
      <div className='font-bold border-b border-dashed border-orange-300 pb-2 mb-2'>{teamLeft.name}</div>
      <div className='font-bold'>{teamRight.name}</div>
      <div>{teamLeft.score}</div>
      <div>{teamRight.score}</div>
    </Link>
  )
}
