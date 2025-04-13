'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from './actions'

export function LoginForm () {
  const [state, loginAction] = useActionState(login, undefined)

  return (
    <form action={loginAction} className='flex max-w-[300px] flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <input id='email' name='email' placeholder='Email' className={'border border-stone-500 rounded p-3'} />
      </div>
      {state?.errors?.email && (
        <p className='text-red-500'>{state.errors.email}</p>
      )}

      <div className='flex flex-col gap-2'>
        <input
          id='password'
          name='password'
          type='password'
          placeholder='Password'
          className={'border border-stone-500 rounded p-3'}
        />
      </div>
      {state?.errors?.password && (
        <p className='text-red-500'>{state.errors.password}</p>
      )}
      <div className={'flex justify-end'}>
      <SubmitButton />

      </div>
    </form>
  )
}

function SubmitButton () {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type='submit' className={'bg-stone-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'}>
      Login
    </button>
  )
}
