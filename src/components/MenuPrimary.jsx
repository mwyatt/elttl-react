'use client'

import React, { useState } from 'react'
import MenuPrimarySubItem from '@/components/MenuPrimarySubItem'
import {BiSolidChevronDown, BiSolidChevronUp} from "react-icons/bi";

export default function MenuPrimary ({ items, menuPrimaryOpenStatuses, setMenuPrimaryOpenStatuses }) {

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
    <div className='flex-grow flex-wrap'>
      <nav className='flex text-xl'>
        {items.map((item, index) => (
          <div
            key={index} className='relative p-4 border-l flex grow gap-4 items-center cursor-pointer'
            onClick={() => handleClick(index)}
          >
            <span className='grow'>{item.name}</span>
            <span className='content-center'>
              {menuPrimaryOpenStatuses[index].isOpen
                ? <BiSolidChevronUp size={30} />
                : <BiSolidChevronDown size={30} />}
            </span>
          </div>
        ))}
      </nav>
    </div>
  )
}
