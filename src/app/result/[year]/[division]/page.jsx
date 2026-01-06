import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import React from 'react'
import SubMenu from '@/app/result/[year]/[division]/SubMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import { linkStyles } from '@/lib/styles'
import { capitalizeFirstLetter } from '@/lib/misc'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'
import SubHeading from '@/components/SubHeading'
import InformationTable from '@/components/team/InformationTable'
import FixtureCard from '@/components/FixtureCard'

export async function generateMetadata (
  { params }
) {
  const division = (await params).division

  return {
    title: getMetaTitle(capitalizeFirstLetter(division) + ' Division Overview'),
    description: `Full overview of the ${division} division, including league table and team fixtures.`
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const division = (await params).division
  const {
    leagueTable,
    teams,
    fulfilledFixtures,
    unfulfillfedFixtures
  } = await fetchJson(`/result/${year}/${division}`)

  const getLeagueTableRow = (teamLeftSlug, teamRightSlug) => {
    for (const row of leagueTable) {
      if (row.teamLeftSlug === teamLeftSlug && row.teamRightSlug === teamRightSlug) {
        return row
      }
    }
  }

  return (
    <FrontLayout visitingYearName={year}>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division) }
          ]
        }
      />
      <h2 className='text-4xl mb-8'>
        <span className='capitalize'>{division}</span> Division
      </h2>
      <p>This is an overview for the {division} division.</p>
      <SubMenu year={year} division={division} />

      <SubHeading name='Teams' />
      <InformationTable yearName={year} teams={teams} />

      <SubHeading name='Overview' />
      <div className='lg:hidden mb-4'>
        <p>Please visit this page using a larger screen to view the divisonal overview.</p>
      </div>
      <table className='w-full hidden lg:table'>
        <thead>
          <tr>
            <th className='border border-stone-400 p-2' />

            {teams.map((team, index) => (
              <th className='border border-stone-400 p-2' key={index}>
                <GeneralLink className={linkStyles.join(' ') + 'border-b-tertiary-500 text-tertiary-500'} href={`/result/${year}/team/${team.slug}`}>{team.name}</GeneralLink>
              </th>
            ))}

          </tr>
        </thead>
        <tbody>

          {teams.map((teamLeft, index) => (
            <tr key={index}>
              <td className='border border-stone-400 p-2'>
                <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/team/${teamLeft.slug}`}>{teamLeft.name}</GeneralLink>
              </td>
              {teams.map((teamRight, trIndex) => {
                const leagueTableRow = getLeagueTableRow(teamLeft.slug, teamRight.slug)
                let scoresContent = ''
                if (leagueTableRow) {
                  scoresContent = <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}>{leagueTableRow.scoreLeft} - {leagueTableRow.scoreRight}</GeneralLink>
                }
                return (
                  <td key={trIndex} className='border border-stone-400 p-2 text-center'>
                    {scoresContent}
                  </td>
                )
              })}
            </tr>
          ))}

        </tbody>
      </table>

      <SubHeading name='Fixtures' />
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>

        {fulfilledFixtures.map((fixture, index) => (
          <FixtureCard
            key={index}
            year={year}
            teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
            teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
            timeFulfilled={fixture.timeFulfilled}
          />
        ))}

        {unfulfillfedFixtures.map((fixture, index) => (
          <FixtureCard
            key={index}
            year={year}
            teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
            teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
            timeFulfilled={fixture.timeFulfilled}
          />
        ))}

      </div>

    </FrontLayout>
  )
}
