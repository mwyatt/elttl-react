'use client'

import React from 'react'
import Link from 'next/link'

export default function MenuPrimarySubItem ({ item, index, menuPrimaryOpenStatuses }) {


  return (
               <div className='relative'>
              <ul
                className={[
                  menuPrimaryOpenStatuses.length && menuPrimaryOpenStatuses[index].isOpen ? 'block' : 'hidden',
                ].join(' ')}
              >
                {item.children.map((subItem) => (
                  <li key={subItem.name}>
                    <Link className='px-4 py-2 block text-lg p-4 border-t border-t-neutral-300' href={subItem.url}>{subItem.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
  )
}
