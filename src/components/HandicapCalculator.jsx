'use client'

import CreatableSelect from 'react-select/creatable'
import { SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'
import { getHandicap, getStartValue } from '@/constants/Handicap'
import { useMemo, useState } from 'react'

export default function HandicapCalculator ({ players }) {
  const [chosenPlayers, setChosenPlayers] = useState({})

  const options = players.map(player => ({
    value: player.id,
    label: player.name + ` (${player.rank})`
  }))

  const handicapInformation = useMemo(() => {
    if (chosenPlayers[SIDE_LEFT] === undefined || chosenPlayers[SIDE_RIGHT] === undefined) {
      return
    }

    const rankLeft = chosenPlayers[SIDE_LEFT].rank
    const rankRight = chosenPlayers[SIDE_RIGHT].rank

    const handicapLeft = getHandicap(rankLeft, rankRight)
    const handicapRight = getHandicap(rankRight, rankLeft)

    const handicapDiff = Math.abs(handicapLeft - handicapRight)

    const disadvantagedPlayer = handicapLeft > handicapRight ? chosenPlayers[SIDE_LEFT] : chosenPlayers[SIDE_RIGHT]

    const startValue = getStartValue(handicapDiff)

    return {
      [SIDE_LEFT]: handicapLeft,
      [SIDE_RIGHT]: handicapRight,
      disadvantagedPlayer,
      startValue
    }
  }, [chosenPlayers])

  const handleChangePlayer = (side, playerId) => {
    const player = players.find(p => p.id === playerId)

    setChosenPlayers({ ...chosenPlayers, [side]: player })
  }

  return (
    <>
      <div className='sm:flex gap-6 mb-4 mt-8'>
        <div className='grow'>
          <CreatableSelect
            className='text-lg'
            options={options}
            onChange={option => handleChangePlayer(SIDE_LEFT, option.value)}
          />
          {handicapInformation && (
            <div className='text-lg p-4 text-center'>
              <p>Handicap: {handicapInformation[SIDE_LEFT]}</p>
            </div>
          )}
        </div>
        <div className='grow'>

          <CreatableSelect
            className='text-lg'
            options={options}
            onChange={option => handleChangePlayer(SIDE_RIGHT, option.value)}
          />
          {handicapInformation && (
            <div className='text-lg p-4 text-center'>
              <p>Handicap: {handicapInformation[SIDE_RIGHT]}</p>
            </div>
          )}
        </div>
      </div>
      {handicapInformation && (
        <div className='mt-4 p-4 border border-gray-300 rounded bg-gray-50 text-2xl text-center'>
          <p>
            <strong>{handicapInformation.disadvantagedPlayer.name}</strong> starts with <strong>{handicapInformation.startValue}</strong>
          </p>
        </div>
      )}
    </>
  )
}
