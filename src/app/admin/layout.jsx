import React from 'react'
import Link from 'next/link'
import {LogoutForm} from "@/app/admin/LogoutForm";

export default async function Layout ({ children }) {

  return (
    <div>
      <div>
        <LogoutForm />
      </div>
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
