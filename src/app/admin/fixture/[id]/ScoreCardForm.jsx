'use client'

import { useActionState, useState } from 'react'
import { PlayerSelect } from '@/app/admin/fixture/[id]/PlayerSelect'
import {
  getOtherSideCapitalized,
  getSideCapitalized,
  scorecardStructure,
  SIDE_LEFT,
  SIDE_RIGHT
} from '@/constants/encounter'
import EncounterStatus from '@/constants/EncounterStatus'
import { update } from '@/app/admin/fixture/[id]/actions'

export function ScoreCardForm ({ fixture, players, encounters }) {
  const [state, updateAction, pending] = useActionState(update, undefined)
  const [playerStruct, setPlayerStruct] = useState(getDefaultPlayerStruct(encounters))
  const [encounterStruct, setEncounterStruct] = useState(getDefaultEncounterStruct(encounters))

  const getGrandTotal = (side) => {
    const sideCapitalized = getSideCapitalized(side)
    const sideScoreKey = `score${sideCapitalized}`

    return encounterStruct.reduce((a, b) => +a + +b[sideScoreKey], 0)
  }

  const ExcludeCheckbox = ({ encounterIndex, isDoubles, isChecked }) => {
    if (isDoubles) {
      return null
    }

    return (
      <label className='text-sm'>
        <input
          className='mr-1'
          type='checkbox'
          checked={isChecked}
          onChange={(e) => {
            const newEncounterStruct = [...encounterStruct]
            newEncounterStruct[encounterIndex].status = e.target.checked ? EncounterStatus.EXCLUDE : EncounterStatus.NONE
            setEncounterStruct(newEncounterStruct)
          }}
        />
        Exclude
      </label>
    )
  }

  const handleChangeScore = (e, index, side, encounter) => {
    const score = parseInt(e.nativeEvent.key)
    const maxScore = 3
    const sideCapitalized = getSideCapitalized(side)
    const otherSideCapitalized = getOtherSideCapitalized(side)
    const sideScoreKey = `score${sideCapitalized}`
    const otherSideScoreKey = `score${otherSideCapitalized}`

    encounter[sideScoreKey] = isNaN(score) ? 0 : score

    // Tidy a score over the max score
    if (encounter[sideScoreKey] > maxScore) {
      encounter[sideScoreKey] = maxScore
    }

    // Chosen score guarantees other score value
    if (encounter[sideScoreKey] < maxScore) {
      encounter[otherSideScoreKey] = maxScore
    }

    // Both scores cannot be max so other reset to 0
    if (encounter[sideScoreKey] === maxScore && encounter[otherSideScoreKey] === maxScore) {
      encounter[otherSideScoreKey] = 0
    }

    const newEncounterStruct = [...encounterStruct]
    newEncounterStruct[index] = {
      ...encounter
    }
    setEncounterStruct(newEncounterStruct)
  }

  const getPlayerName = (id) => {
    const player = players.find(player => player.id === id)
    return player ? player.name : ''
  }

  return (
    <form action={updateAction} className='p-6 max-w-4xl mx-auto'>
      <input name='fixtureId' type='hidden' value={fixture.id} />
      <input name='playerStruct' type='hidden' value={JSON.stringify(playerStruct)} />
      <input name='encounterStruct' type='hidden' value={JSON.stringify(encounterStruct)} />
      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamLeftId} structPosition={[0, 1]} playerSelectedId={playerStruct[0][1]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamRightId} structPosition={[1, 1]} playerSelectedId={playerStruct[1][1]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
      </div>
      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamLeftId} structPosition={[0, 2]} playerSelectedId={playerStruct[0][2]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamRightId} structPosition={[1, 2]} playerSelectedId={playerStruct[1][2]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
      </div>
      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamLeftId} structPosition={[0, 3]} playerSelectedId={playerStruct[0][3]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
        <div className='flex-1'>
          <PlayerSelect teamId={fixture.teamRightId} structPosition={[1, 3]} playerSelectedId={playerStruct[1][3]} playerStruct={playerStruct} setPlayerStruct={setPlayerStruct} players={players} />
        </div>
      </div>
      <hr className='my-6' />
      {scorecardStructure.map((encounterRow, index) => (

        // if index does not exist then skip

        <div key={index} className='flex gap-4 mb-4'>
          <div className='flex flex-1 items-center'>
            <ExcludeCheckbox
              encounterIndex={index}
              isDoubles={encounterRow[0] === EncounterStatus.DOUBLES}
              isChecked={encounterStruct[index].status === EncounterStatus.EXCLUDE}
            />
            <div className='flex-1 flex justify-end'>
              <label>
                {getPlayerName(playerStruct[0][encounterRow[0]])}
                <input
                  className='border border-stone-500 rounded w-14 text-center text-2xl ml-4 py-1'
                  type='text'
                  value={encounterStruct[index].scoreLeft}
                  onChange={() => {}}
                  onKeyUp={(e) => handleChangeScore(e, index, SIDE_LEFT, encounterStruct[index])}
                />
              </label>
            </div>
          </div>
          <div className='flex-1'>
            <label>
              <input
                className='border border-stone-500 rounded w-14 text-center text-2xl mr-4 py-1'
                type='text'
                value={encounterStruct[index].scoreRight}
                onChange={() => {}}
                onKeyUp={(e) => handleChangeScore(e, index, SIDE_RIGHT, encounterStruct[index])}
              />
              {getPlayerName(playerStruct[1][encounterRow[1]])}
            </label>
          </div>
        </div>
      ))}
      <div className='flex text-4xl gap-6 my-6'>
        <div className='flex-1 text-right'>{getGrandTotal(SIDE_LEFT)}</div>
        <div className='flex-1'>{getGrandTotal(SIDE_RIGHT)}</div>
      </div>
      <div className='flex justify-center'>
        <button disabled={pending} type='submit' className='w-32 bg-orange-500 border-b-orange-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-orange-600'>
          Fulfil
        </button>
      </div>
    </form>
  )
}

function getDefaultPlayerStruct (encounters) {
  if (encounters.length > 2) {
    return [
      {
        1: encounters[0].playerIdLeft,
        2: encounters[2].playerIdLeft,
        3: encounters[1].playerIdLeft
      },
      {
        1: encounters[1].playerIdRight,
        2: encounters[0].playerIdRight,
        3: encounters[2].playerIdRight
      }
    ]
  }

  return [
    { 1: 0, 2: 0, 3: 0 },
    { 1: 0, 2: 0, 3: 0 }
  ]
}

function getDefaultEncounterStruct (encounters) {
  if (encounters.length) {
    return encounters
  }

  return [
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: EncounterStatus.DOUBLES
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    },
    {
      playerIdLeft: 0,
      playerIdRight: 0,
      scoreLeft: 0,
      scoreRight: 0,
      status: ''
    }
  ]
}
