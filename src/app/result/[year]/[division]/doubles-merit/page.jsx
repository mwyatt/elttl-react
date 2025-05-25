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

  const response = await fetch(`${apiUrl}/result/${year}/${division}/doubles-merit`)
  const { stats } = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Doubles Merit', href: `/result/${year}/${division}/doubles-merit` }
          ]
        }
      />
                <h2 className='text-4xl mb-8'>
      <span className='capitalize'>{division}</span> Division Doubles Merit Table
    </h2>
      <p>This is the doubles merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className={'p-4'}>Name</th>
            <th className={'p-4'}>Won</th>
            <th className={'p-4'}>Draw</th>
            <th className={'p-4'}>Loss</th>
            <th className={'p-4'}>Played</th>
            <th className={'p-4'}>Points</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat) => (
            <tr className={'border-t border-dashed'}>
              <td className='p-4'>
                <Link className={linkStyles.join(' ')} href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className={'p-4 text-center'}>{stat.won}</td>
              <td className={'p-4 text-center'}>{stat.draw}</td>
              <td className={'p-4 text-center'}>{stat.loss}</td>
              <td className={'p-4 text-center'}>{stat.played}</td>
              <td className={'p-4 text-center'}>{stat.points}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
