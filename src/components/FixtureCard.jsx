'use client'

import Link from 'next/link'

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled, key }) {
  return (
    <Link
      href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className='m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'
    >
      <span className='float-right text-gray-500 text-sm'>{timeFulfilled}</span>
      <div>{teamLeft.name}</div>
      <div>{teamRight.name}</div>
      <div>{teamLeft.score}</div>
      <div>{teamRight.score}</div>
    </Link>
  )
}
