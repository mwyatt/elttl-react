import FrontLayout from '@/app/frontLayout'
import React from 'react'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import { capitalizeFirstLetter } from '@/lib/misc'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'
import Table from '@/app/result/[year]/[division]/rank-merit/Table'

export async function generateMetadata (
  { params }
) {
  const division = (await params).division

  return {
    title: getMetaTitle(capitalizeFirstLetter(division) + ' Division Merit Table'),
    description: `This is a trial merit which attempts to calculate the players effort the ${division} division.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division
  const { stats } = await fetchJson(`/result/${year}/${division}/rank-merit`)

  return (
    <FrontLayout visitingYearName={year}>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Rank Merit Table', href: `/result/${year}/${division}/rank-merit` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division Rank Merit Table
      </h2>
      <p>This is the rank merit table for the <span className='capitalize'>{division}</span> division.</p>
      <SubMenu year={year} division={division} />
      <Table year={year} stats={stats} />
    </FrontLayout>
  )
}
