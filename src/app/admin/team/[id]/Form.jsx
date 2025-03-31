'use client'

import { useActionState } from 'react'
import { update } from './actions'

export function Form ({ team }) {
  const [state, updateAction, pending] = useActionState(update, undefined)

  return (
    <form action={updateAction} className='flex max-w-[300px] flex-col gap-2'>

      <input type='hidden' value={team.id} name='id' />
      <input type='hidden' value={team.yearId} name='yearId' />
      <input type='text' value={team.name} name='name' />
      <input type='text' value={team.slug} name='slug' />

      <button disabled={pending} type='submit'>
        Save
      </button>
    </form>
  )
}
