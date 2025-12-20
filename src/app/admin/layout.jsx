import React from 'react'
import GeneralLink from '@/components/GeneralLink'
import { LogoutForm } from '@/app/admin/LogoutForm'
import ElttlEmblem from '@/components/icons/ElttlEmblem'

export default async function Layout ({ children }) {
  return (
    <div>
      <div className='flex'>
        <div>
          <div className='w-20 mx-auto mb-6'>
            <GeneralLink href='/'>
              <ElttlEmblem />
            </GeneralLink>
          </div>
        </div>
        <div className='flex-1 flex gap-8 m-6'>
          <GeneralLink className='text-primary-500 border-b' href='/admin'>Dash</GeneralLink>
          <GeneralLink className='text-primary-500 border-b' href='/admin/player'>Players</GeneralLink>
          <GeneralLink className='text-primary-500 border-b' href='/admin/fixture'>Fixtures</GeneralLink>
          <GeneralLink className='text-primary-500 border-b' href='/admin/week'>Weeks</GeneralLink>
          {/* <GeneralLink className='text-primary-500 border-b' href='/admin/season'>Season</GeneralLink> */}
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
