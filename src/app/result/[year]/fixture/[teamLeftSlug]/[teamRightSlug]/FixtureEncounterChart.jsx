'use client'

import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { scorecardStructure } from '@/constants/encounter'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../../../../../tailwind.config.mjs'
import { getEncounterMerit } from '@/lib/encounter'
import Link from 'next/link'
import { linkStyles } from '@/lib/styles'
import { getShortPlayerName } from '@/lib/player'
import EncounterStatus from '@/constants/EncounterStatus'

export default function ({ year, encounters, teamLeftName, teamRightName }) {
  const tailwindFull = resolveConfig(tailwindConfig)
  const stats = getEncounterMerit(
    encounters.filter(encounter => encounter.status !== EncounterStatus.DOUBLES)
  )
  const chartData = []
  let currentPointsLeft = 0
  let currentPointsRight = 0

  scorecardStructure.forEach((scorecardRow, index) => {
    const encounter = encounters[index]

    chartData.push({
      name: `${encounter.playerLeftName} vs ${encounter.playerRightName}`,
      scorecardNumbers: `${scorecardRow[0]}/${scorecardRow[1]}`,
      leftPoints: currentPointsLeft += encounter.scoreLeft,
      rightPoints: currentPointsRight += encounter.scoreRight
    })
  })

  const getIntroOfPage = (label) => {
    // @todo reverse engineer 1/3 to get encounter
    // then display player name vs player name and also scores / winner / loser

    if (label === 'Page A') {
      return 'Page A is about men\'s clothing'
    }
    if (label === 'Page B') {
      return 'Page B is about women\'s dress'
    }
    if (label === 'Page C') {
      return 'Page C is about women\'s bag'
    }
    if (label === 'Page D') {
      return 'Page D is about household goods'
    }
    if (label === 'Page E') {
      return 'Page E is about food'
    }
    if (label === 'Page F') {
      return 'Page F is about baby food'
    }
    return 'what'
  }

  const CustomTooltip = ({ active, payload, label }) => {
    console.log({ active, payload, label })
    const isVisible = active && payload && payload.length
    return (
      <div className="p-2 rounded bg-stone-100" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
        {isVisible && (
          <>
            <p className="label">{`${label} : ${payload[0].value}`}</p>
            <p className="intro">{getIntroOfPage(label)}</p>
            <p className="desc">Anything you want can be displayed here.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <LineChart
        style={{ width: '100%', aspectRatio: 1.618 }}
        responsive
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 5,
          left: 0,
        }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
        <Line type="natural" dataKey="leftPoints" stroke={tailwindFull.theme.outlineColor.primary[500]} strokeWidth={2}
              name={teamLeftName} isAnimationActive={false} />
        <Line type="natural" dataKey="rightPoints" stroke={tailwindFull.theme.outlineColor.secondary[500]}
              strokeWidth={2} name={teamRightName} isAnimationActive={false} />
        <XAxis dataKey="scorecardNumbers"/>
        <YAxis width="auto" label={{ value: 'Points', position: 'insideLeft', angle: -90 }}/>
        <Legend align="right"/>
        <Tooltip content={CustomTooltip} isAnimationActive={false}/>
      </LineChart>

      <table className="table-auto w-full mt-4">
        <thead>
        <tr>
          <th className="p-2 md:p-4"></th>
          <th className="p-2 md:p-4">R<span className="hidden sm:inline">atio</span></th>
          <th className="p-2 md:p-4">Games W<span className="hidden sm:inline">on</span></th>
          <th className="p-2 md:p-4">Games L<span className="hidden sm:inline">ost</span></th>
          <th className="p-2 md:p-4">Diff<span className="hidden sm:inline">erence</span></th>
        </tr>
        </thead>
        <tbody>

        {stats.map((stat, index) => (
          <tr key={index} className="border-t border-dashed hover:bg-gray-100">
            <td className="p-2 md:p-4">
              <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${stat.player.slug}`}>
                <span className="sm:hidden">{getShortPlayerName(stat.player.name)}</span>
                <span className="hidden sm:inline">{stat.player.name}</span>
              </Link>
            </td>
            <td className="p-2 md:p-4 text-center">{stat.encountersWon} <span className={'text-stone-300'}>/</span> {stat.encountersLost}</td>
            <td className="p-2 md:p-4 text-center">{stat.won}</td>
            <td className="p-2 md:p-4 text-center">{stat.lost}</td>
            <td className="p-2 md:p-4 text-center">{stat.difference}</td>
          </tr>
        ))}

        </tbody>
      </table>

    </>
  )
}
