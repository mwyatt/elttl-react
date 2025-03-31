import React from 'react'
import Link from 'next/link'

export default async function Layout ({ children }) {
  return (
    <div className=''>
      <div>
        <Link href='/admin'>Dash</Link>
        <Link href='/admin/team'>Teams</Link>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
