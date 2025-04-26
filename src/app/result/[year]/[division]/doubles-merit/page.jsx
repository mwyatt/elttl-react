import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import { apiUrl } from '@/constants/url'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}/doubles-merit`)
  const { stats } = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: division, href: `/result/${year}/${division}` },
            { name: 'Doubles Merit', href: `/result/${year}/${division}/doubles-merit` }
          ]
        }
      />
      <h2 className='text-2xl mb-4'><span className='capitalize'>{division}</span> Division Doubles Merit Table</h2>
      <p>This is the doubles merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Loss</th>
            <th>Played</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat) => (
            <tr>
              <td className='border border-amber-400'>
                <Link href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td>{stat.won}</td>
              <td>{stat.draw}</td>
              <td>{stat.loss}</td>
              <td>{stat.played}</td>
              <td>{stat.points}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
