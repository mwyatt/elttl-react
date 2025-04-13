import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import { apiUrl } from '@/constants/url'
import SubMenu from "@/app/result/[year]/[division]/SubMenu";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}/league`)
  const { stats } = await response.json()

  return (
    <FrontLayout>
            <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: division, href: `/result/${year}/${division}` },
            { name: 'League', href: `/result/${year}/${division}/league` },
          ]
        }
        />
      <h2 className='text-2xl mb-4'><span className='capitalize'>{division}</span> Division League Table</h2>
      <p>This is the league table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>W<span className={'hidden sm:inline'}>on</span></th>
            <th>D<span className={'hidden sm:inline'}>raw</span></th>
            <th>L<span className={'hidden sm:inline'}>oss</span></th>
            <th>Pl<span className={'hidden sm:inline'}>aye</span>d</th>
            <th>P<span className={'hidden sm:inline'}>oin</span>ts</th>
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
