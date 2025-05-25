import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import { apiUrl } from '@/constants/url'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import {linkStyles} from "@/lib/styles";
import {capitalizeFirstLetter} from "@/lib/misc";

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
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Merit Table', href: `/result/${year}/${division}/merit` }
          ]
        }
      />
          <h2 className='text-4xl mb-8'>
      <span className='capitalize'>{division}</span> Division League Table
    </h2>
      <p>This is the merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className={'p-4'}>Name</th>
            <th className={'p-4'}>Team</th>
            <th className={'p-4'}>R<span className='hidden sm:inline'>a</span>nk</th>
            <th className={'p-4'}>W<span className='hidden sm:inline'>on</span></th>
            <th className={'p-4'}>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th className={'p-4'}>Av<span className='hidden sm:inline'>era</span>g<span className='hidden sm:inline'>e</span></th>
            <th className={'p-4'}>Encounters</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className={'border-t border-dashed hover:bg-gray-100'}>
              <td className={'p-4'}>
                <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${stat.player.slug}`}>{stat.player.name}</Link>
              </td>
              <td className={'p-4'}>
                <Link className={`${linkStyles.join(' ')} text-stone-500 border-b-stone-500`} href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className={'p-4 text-center'}>{stat.rank}</td>
              <td className={'p-4 text-center'}>{stat.won}</td>
              <td className={'p-4 text-center'}>{stat.played}</td>
              <td className={'p-4 text-center'}>{Math.floor(stat.average * 100)}</td>
              <td className={'p-4 text-center'}>{stat.encounter}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
