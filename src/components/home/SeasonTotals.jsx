'use client'

import Link from 'next/link'
import { allHomeButtonStyles } from '@/lib/styles'

export default function SeasonTotals ({ yearName, totals }) {
  const Panel = ({ name, total, url }) => (
    <Link
      href={url} className='flex-wrap flex p-6 grow text-xl flex-col items-center gap-2 rounded bg-primary-500 text-white'
    >
      <span className='text-5xl font-semibold'>{total}</span>
      {name}
    </Link>
  )

  return (
    <div>
      <div className='flex p-4 items-center'>

        <h2 className='text-2xl grow'>Season {yearName}-{parseInt(yearName) + 1}</h2>
        <Link className={allHomeButtonStyles} href={`/result/${yearName}`}>Season Overview</Link>
      </div>
      <div className='flex flex-wrap gap-3 mb-6 p-4'>
        <Panel name='Divisions' url={`/result/${yearName}`} total={totals.divisions} />
        <Panel name='Teams' url={`/result/${yearName}`} total={totals.teams} />
        <Panel name='Players' url={`/result/${yearName}`} total={totals.players} />
        <Panel
          name='Fixtures Fulfilled' url={`/result/${yearName}`} total={
            <span>
              {totals.fixtures.fulfilled}<span className='opacity-50'>/{totals.fixtures.total}</span>
            </span>
            }
        />
      </div>
    </div>
  )
}
