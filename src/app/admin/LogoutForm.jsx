'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { logout } from '@/app/login/actions'

export function LogoutForm () {
  const { pending } = useFormStatus()
  const [state, logoutAction] = useActionState(logout, undefined)

  return (
    <form action={logoutAction}>
      <button disabled={pending} type='submit' className='bg-stone-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'>
        Logout
      </button>
    </form>
  )
}
