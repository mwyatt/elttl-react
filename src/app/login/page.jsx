import { LoginForm } from './LoginForm'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Login () {
  return (
    <div className='flex flex-row min-h-screen justify-center items-center pb-14'>
      <div className='border border-stone-500 p-6 rounded'>
        <div className='w-20 mx-auto mb-6'>
          <Link href='/'>
            <ElttlEmblem />
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
