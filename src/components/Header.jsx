"use client"

import Link from 'next/link'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import MenuPrimary from '@/components/MenuPrimary'
import MenuPrimarySubItem from "@/components/MenuPrimarySubItem";
import {useState} from "react";
import {getMetaTitle} from "@/constants/MetaData";

export default function Header ({ menuPrimary }) {
  const appName = getMetaTitle()

  const [menuPrimaryOpenStatuses, setMenuPrimaryOpenStatuses] = useState(
    menuPrimary.map(() => ({ isOpen: false }))
  )

  return (
          <header className='border-b border-b-slate-300 bg-white drop-shadow-sm'>
        <div className='max-w-[1440px] sm:flex mx-auto border-l border-l-slate-200'>
          <Link
            href='/'
            className='flex-1 flex flex-grow gap-2 sm:gap-4 p-4 items-center justify-center sm:justify-start border-b sm:border-none sm:max-w-[500px]'
            title={`${appName} - Home`}
          >
            <ElttlEmblem className='md:hidden' width='50px' />
            <ElttlEmblem className='hidden md:block' width='75px' />
            <span className=''>
              <span className='hidden md:block text-4xl'>{appName}</span>
              <span className='md:hidden text-5xl font-bold'>ELTTL</span>
            </span>
          </Link>
          <MenuPrimary items={menuPrimary} menuPrimaryOpenStatuses={menuPrimaryOpenStatuses} setMenuPrimaryOpenStatuses={setMenuPrimaryOpenStatuses} />
        </div>
              <div className={'block'}>
        {menuPrimary.map((item, index) => (
              <div className=''>
      <ul
        className={[
          menuPrimaryOpenStatuses.length && menuPrimaryOpenStatuses[index].isOpen ? 'block' : 'hidden'
        ].join(' ')}
      >
        {item.children.map((subItem) => (
          <li key={subItem.name}>
            <Link className='px-4 py-2 block text-lg p-4 border-t border-t-neutral-300' href={subItem.url}>{subItem.name}</Link>
          </li>
        ))}
      </ul>
    </div>
        ))}
      </div>
      </header>

  )
}
