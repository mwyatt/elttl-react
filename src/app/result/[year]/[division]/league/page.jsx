import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import { linkStyles } from '@/lib/styles'
import { capitalizeFirstLetter } from '@/lib/misc'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

export async function generateMetadata (
  { params }
) {
  const division = (await params).division

  return {
    title: getMetaTitle(capitalizeFirstLetter(division) + ' Division League Table'),
    description: `This is the league table for the ${division} division.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division
  const { stats } = await fetchJson(`/result/${year}/${division}/league`)

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'League', href: `/result/${year}/${division}/league` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division League Table
      </h2>
      <p>This is the league table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-1 sm:p-2 md:p-4'>Name</th>
            <th className='p-1 sm:p-2 md:p-4'>W<span className='hidden sm:inline'>on</span></th>
            <th className='p-1 sm:p-2 md:p-4'>D<span className='hidden sm:inline'>raw</span></th>
            <th className='p-1 sm:p-2 md:p-4'>L<span className='hidden sm:inline'>oss</span></th>
            <th className='p-1 sm:p-2 md:p-4'>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th className='p-1 sm:p-2 md:p-4'>P<span className='hidden sm:inline'>oin</span>ts</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-dashed border-t hover:bg-gray-100'>
              <td className='p-1 sm:p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className='text-center p-1 sm:p-2 md:p-4'>{stat.won}</td>
              <td className='text-center p-1 sm:p-2 md:p-4'>{stat.draw}</td>
              <td className='text-center p-1 sm:p-2 md:p-4'>{stat.loss}</td>
              <td className='text-center p-1 sm:p-2 md:p-4'>{stat.played}</td>
              <td className='text-center p-1 sm:p-2 md:p-4'>{stat.points}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
