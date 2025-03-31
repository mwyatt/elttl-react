import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import React from 'react'

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
      <div>
        <Link href='/result'>Results</Link>
        <Link href={`/result/${year}}`}>{year}</Link>
      </div>
      <h2 className='text-2xl mb-4'><span className='capitalize'>{division}</span> Division</h2>
      <p>This is an overview for the {division} division.</p>
      <div>
        <Link href={`/result/${year}/${division}/league`}>
          League Table
        </Link>
        <Link href={`/result/${year}/${division}/merit`}>
          Merit Table
        </Link>
        <Link href={`/result/${year}/${division}/merit-doubles`}>
          Doubles Merit Table
        </Link>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th />

            {teams.map((team, index) => (
              <th key={index}>
                <Link href={`/result/${year}/team/${team.slug}`}>{team.name}</Link>
              </th>
            ))}

          </tr>
        </thead>
        <tbody>

          {teams.map((teamLeft) => (
            <tr>
              <td className='border border-amber-400'>
                <Link href={`/result/${year}/team/${teamLeft.slug}`}>{teamLeft.name}</Link>
              </td>
              {teams.map((teamRight) => {
                const leagueTableRow = getLeagueTableRow(teamLeft.slug, teamRight.slug)
                let scoresContent = ''
                if (leagueTableRow) {
                  scoresContent = <Link href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}>{leagueTableRow.scoreLeft} - {leagueTableRow.scoreRight}</Link>
                }
                return (
                  <td className='border border-amber-400'>
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
