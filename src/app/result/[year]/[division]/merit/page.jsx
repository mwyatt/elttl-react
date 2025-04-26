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

  const response = await fetch(`${apiUrl}/result/${year}/${division}/merit`)
  const { stats } = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: division, href: `/result/${year}/${division}` },
            { name: 'Merit', href: `/result/${year}/${division}/merit` }
          ]
        }
      />
      <h2 className='text-2xl mb-4'><span className='capitalize'>{division}</span> Division Merit Table</h2>
      <p>This is the merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>R<span className='hidden sm:inline'>a</span>nk</th>
            <th>W<span className='hidden sm:inline'>on</span></th>
            <th>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th>Av<span className='hidden sm:inline'>era</span>g<span className='hidden sm:inline'>e</span></th>
            <th>Encounters</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index}>
              <td className='border border-amber-400'>
                <Link href={`/result/${year}/player/${stat.player.slug}`}>{stat.player.name}</Link>
              </td>
              <td className='border border-amber-400'>
                <Link href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td>{stat.rank}</td>
              <td>{stat.won}</td>
              <td>{stat.played}</td>
              <td>{stat.average}</td>
              <td>{stat.encounter}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
