'use client'

import { useRouter } from 'next/navigation'
import { linkStyles } from '@/lib/styles'
import GeneralLink from '@/components/GeneralLink'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import { useEffect } from 'react'

export default function Page ({ error }) {
  const router = useRouter()

  useEffect(() => {
    // Logs error to server logs (via console.error → pm2 error log)
    console.error('❌ Next.js error boundary:', error)
  }, [error])

  return (
    <div className='flex flex-col items-center py-12'>
      <div className='w-20 mx-auto mb-6'>
        <GeneralLink href='/'>
          <ElttlEmblem />
        </GeneralLink>
      </div>
      <div className='max-w-96 mx-auto mb-6 flex flex-col items-center text-center gap-6 p-4'>
        <h1 className='text-3xl font-bold'>Whoops!</h1>
        <p className='text-lg'>This shot just missed the table! There was an unexpected issue while loading this area. Please <GeneralLink className={linkStyles.join(' ')} href='/contact-us'>contact us</GeneralLink> about it so we can investigate the issue further.</p>
        <button className='bg-primary-500 rounded px-5 py-2 text-white font-bold mt-3' onClick={() => router.back()}>Go Back</button>
      </div>
    </div>
  )
}
