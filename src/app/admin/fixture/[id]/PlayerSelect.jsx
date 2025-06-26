'use client'

import React from 'react'
import dynamic from "next/dynamic";
import { getSideIndex, SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'
const CreatableSelect = dynamic(() => import("react-select/creatable"), { ssr: false });

// @todo prevent the same player being selected twice in either team
export function PlayerSelect ({
  teamId,
  structPosition,
  players,
  playerSelectedId,
  setPlayerStruct,
  playerStruct
}) {
  const playersSelected = Object.keys(playerStruct[getSideIndex(SIDE_LEFT)]).map((key) => {
    if (playerSelectedId === playerStruct[getSideIndex(SIDE_LEFT)][key]) {
      return
    }
    return playerStruct[getSideIndex(SIDE_LEFT)][key]
  }).concat(
    Object.keys(playerStruct[getSideIndex(SIDE_RIGHT)]).map((key) => {
      if (playerSelectedId === playerStruct[getSideIndex(SIDE_RIGHT)][key]) {
        return
      }
      return playerStruct[getSideIndex(SIDE_RIGHT)][key]
    })
  )

  const playersOtherThanSelected = players
    .filter(player => !playersSelected.includes(player.id))

  const playersInTeam = playersOtherThanSelected.filter(player => player.teamId === teamId)

  // Sort players in team by rank highest first
  playersInTeam.sort((a, b) => (a.rank > b.rank ? -1 : 1))

  const otherPlayers = playersOtherThanSelected
    .filter(player => player.teamId !== teamId)

  const playerOptions = playersInTeam.map(player => ({
    value: player.id,
    label: player.name + ` (${player.rank})`
  })).concat(
    otherPlayers.map(player => ({
      value: player.id,
      label: player.name + ` (${player.rank})`
    }))
  )
  const options = [
    {
      value: 0,
      label: 'Absent Player',
    },
    ...playerOptions
  ]

  const selectedOption = options.find(option => option.value === playerSelectedId)

  return (
    <CreatableSelect
      options={options}
      defaultValue={selectedOption}
      onChange={option => setPlayerStruct(
        prev => {
          const newStruct = [...prev]
          newStruct[structPosition[0]][structPosition[1]] = option.value
          return newStruct
        }
      )}
    />
  )
}
