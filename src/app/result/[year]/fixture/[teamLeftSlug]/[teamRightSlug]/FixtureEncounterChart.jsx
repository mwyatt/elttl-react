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
import classNames from 'classnames'

export default function FixtureEncounterChart ({ year, encounters, teamLeftName, teamRightName }) {
  const tailwindFull = resolveConfig(tailwindConfig)
  const stats = getEncounterMerit(
    encounters.filter(encounter => encounter.status !== EncounterStatus.DOUBLES)
  )
  const chartData = []
  const encountersByLabel = {}
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

    encountersByLabel[`${scorecardRow[0]}/${scorecardRow[1]}`] = encounter
  })

  const CustomTooltip = ({ active, payload, label }) => {
    const isVisible = active && payload && payload.length
    const encounter = encountersByLabel[label]
    const doublesCapitalised = EncounterStatus.DOUBLES.charAt(0).toUpperCase() + EncounterStatus.DOUBLES.slice(1)

    if (!isVisible) {
      return null
    }

    return (
      <TipCard
        isVisible={isVisible}
        leftName={encounter.playerLeftName ? encounter.playerLeftName : doublesCapitalised}
        rightName={encounter.playerRightName ? encounter.playerRightName : doublesCapitalised}
        scoreLeft={encounter.scoreLeft}
        scoreRight={encounter.scoreRight}
      />
    )
  }

  return (
    <>
      {/* Demo tip card */}
      <TipCard
        isVisible={false}
        leftName='left name'
        rightName='right name'
        scoreLeft={3}
        scoreRight={2}
      />

      <LineChart
        style={{ width: '100%', aspectRatio: 1.618 }}
        responsive
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 5,
          left: 0
        }}
      >
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <Line
          type='natural' dataKey='leftPoints' stroke={tailwindFull.theme.outlineColor.primary[500]} strokeWidth={2}
          name={teamLeftName} isAnimationActive={false}
        />
        <Line
          type='natural' dataKey='rightPoints' stroke={tailwindFull.theme.outlineColor.secondary[500]}
          strokeWidth={2} name={teamRightName} isAnimationActive={false}
        />
        <XAxis dataKey='scorecardNumbers' />
        <YAxis width='auto' label={{ value: 'Points', position: 'insideLeft', angle: -90 }} />
        <Legend align='right' />
        <Tooltip content={CustomTooltip} isAnimationActive={false} />
      </LineChart>

      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4' />
            <th className='p-2 md:p-4'>R<span className='hidden sm:inline'>atio</span></th>
            <th className='p-2 md:p-4'>Games W<span className='hidden sm:inline'>on</span></th>
            <th className='p-2 md:p-4'>Games L<span className='hidden sm:inline'>ost</span></th>
            <th className='p-2 md:p-4'>Diff<span className='hidden sm:inline'>erence</span></th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr
              key={index} className={classNames({
                'border-t': true,
                'border-dashed': true,
                'hover:bg-gray-100': true
              })}
            >
              <td className='p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} href={`/result/${year}/player/${stat.player.slug}`}>
                  <span className='sm:hidden'>{getShortPlayerName(stat.player.name)}</span>
                  <span className='hidden sm:inline'>{stat.player.name}</span>
                </Link>
              </td>
              <td className='p-2 md:p-4 text-center'>
                {stat.encountersWon}
                <span className='text-stone-300'>/</span> {stat.encountersLost}
              </td>
              <td className='p-2 md:p-4 text-center'>{stat.won}</td>
              <td className='p-2 md:p-4 text-center'>{stat.lost}</td>
              <td className='p-2 md:p-4 text-center'>{stat.difference}</td>
            </tr>
          ))}

        </tbody>
      </table>

    </>
  )
}

const TipCard = ({ isVisible, leftName, rightName, scoreLeft, scoreRight }) => {
  return (
    <div
      className='p-2 rounded bg-stone-100 border border-stone-300 shadow flex gap-2'
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <p className='flex flex-col gap-1'>
        <span className='text-primary-500'>{leftName}</span>
        <span className='text-secondary-500'>{rightName}</span>
      </p>
      <p className='flex flex-col gap-1'>
        <span className='text-primary-500'>{scoreLeft}</span>
        <span className='text-secondary-500'>{scoreRight}</span>
      </p>
    </div>
  )
}
