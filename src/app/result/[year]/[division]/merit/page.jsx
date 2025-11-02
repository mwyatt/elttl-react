import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import { linkStyles } from '@/lib/styles'
import { capitalizeFirstLetter } from '@/lib/misc'
import { getShortPlayerName } from '@/lib/player'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

export async function generateMetadata (
  { params }
) {
  const division = (await params).division

  return {
    title: getMetaTitle(capitalizeFirstLetter(division) + ' Division Merit Table'),
    description: `This is the merit table for the ${division} division.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division
  const { stats } = await fetchJson(`/result/${year}/${division}/merit`)

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Merit Table', href: `/result/${year}/${division}/merit` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division Merit Table
      </h2>
      <p>This is the merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4'>Name</th>
            <th className='p-2 md:p-4 hidden sm:block'>Team</th>
            <th className='p-2 md:p-4'>R<span className='hidden sm:inline'>a</span>nk</th>
            <th className='p-2 md:p-4'>W<span className='hidden sm:inline'>on</span></th>
            <th className='p-2 md:p-4'>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th className='p-2 md:p-4'>Av<span className='hidden sm:inline'>era</span>g<span className='hidden sm:inline'>e</span></th>
            <th className='p-2 md:p-4'>Enc<span className='hidden sm:inline'>ounters</span></th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
              <td className='p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${stat.player.slug}`}>
                  <span className='sm:hidden'>{getShortPlayerName(stat.player.name)}</span>
                  <span className='hidden sm:inline'>{stat.player.name}</span>
                </Link>
              </td>
              <td className='p-2 hidden sm:block md:p-4'>
                <Link className={`${linkStyles.join(' ')} text-tertiary-500 border-b-tertiary-500`} href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className='p-2 md:p-4 text-center'>{stat.player.rank}</td>
              <td className='p-2 md:p-4 text-center'>{stat.won}</td>
              <td className='p-2 md:p-4 text-center'>{stat.played}</td>
              <td className='p-2 md:p-4 text-center'>{Math.floor(stat.average * 100)}</td>
              <td className='p-2 md:p-4 text-center'>{stat.encounter}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
