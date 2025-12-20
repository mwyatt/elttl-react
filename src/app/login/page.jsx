import { LoginForm } from './LoginForm'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import GeneralLink from '@/components/GeneralLink'

export const dynamic = 'force-dynamic'

export default function Login () {
  return (
    <div className='flex flex-row min-h-screen justify-center items-center pb-14'>
      <div className='border border-tertiary-500 p-6 rounded'>
        <div className='w-20 mx-auto mb-2'>
          <GeneralLink href='/'>
            <ElttlEmblem />
          </GeneralLink>
        </div>
        <div className='text-xs text-stone-400 text-center mb-4'>Version {process.env.NEXT_CURRENT_VERSION}</div>
        <LoginForm />
      </div>
    </div>
  )
}
