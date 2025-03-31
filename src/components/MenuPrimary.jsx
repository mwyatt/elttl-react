'use client'

import React, { useState } from 'react'
import Arrow from '@/components/icons/Arrow'
import Link from 'next/link'

export default function MenuPrimary ({ items }) {
  const [menuPrimaryOpenStatuses, setMenuPrimaryOpenStatuses] = useState(
    items.map(() => ({ isOpen: false }))
  )

  const handleClick = (index) => {
    menuPrimaryOpenStatuses.forEach((status, i) => {
      if (i !== index) {
        status.isOpen = false
      }
    })
    menuPrimaryOpenStatuses[index].isOpen = !menuPrimaryOpenStatuses[index].isOpen
    setMenuPrimaryOpenStatuses([...menuPrimaryOpenStatuses])
  }

  return (
    <div className=''>
      <nav className='flex text-xl'>
        {items.map((item, index) => (
          <div
            key={index} className='relative p-4 border-l flex grow gap-4 items-center'
            onClick={() => handleClick(index)}
          >
            <span className='grow'>{item.name}</span>
            <span className='content-center'><Arrow /></span>
            <div className='relative'>

              <ul
                key={index}
                className={[
                  menuPrimaryOpenStatuses.length && menuPrimaryOpenStatuses[index].isOpen ? 'block' : 'hidden',
                  'absolute top-0 left-0 bg-white border border-gray-200 shadow '
                ].join(' ')}
              >
                {item.children.map((subItem) => (
                  <li key={subItem.name}>
                    <Link className='px-4 py-2 block' href={subItem.url}>{subItem.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </nav>
      {/* {items.map((item, index) => ( */}
      {/* ))} */}
    </div>
  )
}
