'use client'

import React, { useState } from 'react'
import Arrow from '@/components/icons/Arrow'
import MenuPrimarySubItem from '@/components/MenuPrimarySubItem'

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
    <div className='flex-grow'>
      <nav className='flex text-xl'>
        {items.map((item, index) => (
          <div
            key={index} className='relative p-4 border-l flex grow gap-4 items-center cursor-pointer'
            onClick={() => handleClick(index)}
          >
            <span className='grow'>{item.name}</span>
            <span className='content-center'><Arrow /></span>

            <div className='hidden sm:block absolute top-0 left-0 bg-white border border-gray-200 shadow'>
              <MenuPrimarySubItem key={index} index={index} item={item} menuPrimaryOpenStatuses={menuPrimaryOpenStatuses} />
            </div>

          </div>
        ))}
      </nav>
      <div className='sm:hidden'>
        {items.map((item, index) => (
          <MenuPrimarySubItem key={index} index={index} item={item} menuPrimaryOpenStatuses={menuPrimaryOpenStatuses} />
        ))}
      </div>
    </div>
  )
}
