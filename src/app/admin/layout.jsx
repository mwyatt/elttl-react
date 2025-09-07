import React from 'react'
import Link from 'next/link'
import { LogoutForm } from '@/app/admin/LogoutForm'
import ElttlEmblem from '@/components/icons/ElttlEmblem'

export default async function Layout ({ children }) {
  return (
    <div>
      <div className='flex'>
        <div>
          <div className='w-20 mx-auto mb-6'>
            <Link href='/'>
              <ElttlEmblem />
            </Link>
          </div>
        </div>
        <div className='flex-1 flex gap-8 m-6'>
          <Link className='text-primary-500 border-b' href='/admin'>Dash</Link>
          {/* <Link className='text-primary-500 border-b' href='/admin/team'>Teams</Link> */}
           <Link className='text-primary-500 border-b' href='/admin/player'>Players</Link>
          <Link className='text-primary-500 border-b' href='/admin/fixture'>Fixtures</Link>
          {/* <Link className='text-primary-500 border-b' href='/admin/season'>Season</Link> */}
        </div>
        <div className='flex justify-end m-6'>
          <LogoutForm />
        </div>
      </div>
      <div className='max-w-[1440px] mx-auto'>
        {children}
      </div>
    </div>
  )
}
