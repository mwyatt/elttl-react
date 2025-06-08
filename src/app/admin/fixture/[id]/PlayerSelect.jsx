'use client'

import Select from 'react-select'

export function PlayerSelect ({ teamId, structPosition, players, playerSelectedId, setPlayerStruct, playerStruct }) {
  const playersInTeam = players.filter(player => player.teamId === teamId)

  // Sort players in team by rank highest first
  playersInTeam.sort((a, b) => (a.rank > b.rank ? -1 : 1))

  const otherPlayers = players.filter(player => player.teamId !== teamId)

  const playerOptions = playersInTeam.map(player => ({
    value: player.id,
    label: player.name
  })).concat(
    otherPlayers.map(player => ({
      value: player.id,
      label: player.name
    }))
  )
  const options = [
    {
      value: 0,
      label: 'Absent Player'
    },
    ...playerOptions
  ]

  const selectedOption = options.find(option => option.value === playerSelectedId)

  return (
    <Select
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
