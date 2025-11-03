'use client'

import { useActionState } from 'react'
import { update } from './actions'

export function Form ({ team, divisions }) {
  const [state, updateAction, pending] = useActionState(update, undefined)

  return (
    <form action={updateAction} className='flex max-w-[300px] flex-col gap-2' data-state={state}>

      <input className='border border-tertiary-500 p-2' type='hidden' value={team.id} name='id' />
      <input className='border border-tertiary-500 p-2' type='text' defaultValue={team.name} name='name' />
      <input className='border border-tertiary-500 p-2' type='text' defaultValue={team.slug} name='slug' />
      <select className='border border-tertiary-500 p-2' name='divisionId'>
        {divisions.map((division) => (
          <option key={division.id} value={division.id} defaultValue={team.divisionId}>
            {division.name}
          </option>
        ))}
      </select>

      <button disabled={pending} type='submit'>
        Save
      </button>
    </form>
  )
}
