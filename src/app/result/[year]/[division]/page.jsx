import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'
import SubMenu from "@/app/result/[year]/[division]/SubMenu";
import Breadcrumbs from "@/components/Breadcrumbs";
import {linkStyles} from "@/lib/styles";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}`)
  const { leagueTable, teams } = await response.json()

  const getLeagueTableRow = (teamLeftSlug, teamRightSlug) => {
    for (const row of leagueTable) {
      if (row.teamLeftSlug === teamLeftSlug && row.teamRightSlug === teamRightSlug) {
        return row
      }
    }
  }

  return (
    <FrontLayout>

              <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: division, href: `/result/${year}/${division}` },
          ]
        }
        />

      <h2 className='text-2xl mb-4'><span className='capitalize'>{division}</span> Division</h2>
      <p>This is an overview for the {division} division.</p>
      <SubMenu year={year} division={division} />
      <table className='table w-full'>
        <thead>
          <tr>
            <th className={'border border-stone-400 p-2'} />

            {teams.map((team, index) => (
              <th className={'border border-stone-400 p-2'} key={index}>
                <Link className={`${linkStyles}`} href={`/result/${year}/team/${team.slug}`}>{team.name}</Link>
              </th>
            ))}

          </tr>
        </thead>
        <tbody>

          {teams.map((teamLeft) => (
            <tr>
              <td className='border border-stone-400 p-2'>
                <Link className={linkStyles} href={`/result/${year}/team/${teamLeft.slug}`}>{teamLeft.name}</Link>
              </td>
              {teams.map((teamRight) => {
                const leagueTableRow = getLeagueTableRow(teamLeft.slug, teamRight.slug)
                let scoresContent = ''
                if (leagueTableRow) {
                  scoresContent = <Link className={linkStyles} href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}>{leagueTableRow.scoreLeft} - {leagueTableRow.scoreRight}</Link>
                }
                return (
                  <td className='border border-stone-400 p-2 text-center'>
                    {scoresContent}
                  </td>
                )
              })}
            </tr>
          ))}

        </tbody>
      </table>
    </FrontLayout>
  )
}
