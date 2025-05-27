'use client'

import Link from 'next/link'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import MenuPrimary from '@/components/MenuPrimary'
import { useState } from 'react'
import { getMetaTitle } from '@/constants/MetaData'
import { BiBook, BiCode, BiMap, BiNews, BiTrophy } from 'react-icons/bi'
import { VscCode } from 'react-icons/vsc'

export default function Header ({ menuPrimary }) {
  const appName = getMetaTitle()

  const [primaryOpenStatuses, setPrimaryOpenStatuses] = useState(
    menuPrimary.map(() => ({ isOpen: false }))
  )

  const getIcon = (name) => {
    switch (name) {
      case 'Download Handbook':
        return <BiBook className='mt-1 mr-2' size={20} />
      case 'Fixtures':
        return <BiCode className='mt-1 mr-2' size={20} />
      case 'Press Releases':
        return <BiNews className='mt-1 mr-2' size={20} />
      case 'Competitions':
        return <BiTrophy className='mt-1 mr-2' size={20} />
      case 'Contact us':
        return <BiMap className='mt-1 mr-2' size={20} />
      default:
        return null
    }
  }

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
        <MenuPrimary items={menuPrimary} primaryOpenStatuses={primaryOpenStatuses} setPrimaryOpenStatuses={setPrimaryOpenStatuses} />
      </div>
      <div>
        <div className='max-w-[1440px] mx-auto'>
          {menuPrimary.map((primaryItem, index) => (
            <div
              key={primaryItem.name}
              className={[
                primaryOpenStatuses[index].isOpen ? 'block' : 'hidden',
                'h-full'
              ].join(' ')}
            >
              {primaryItem.children && (
                <div className='lg:flex lg:gap-4 lg:justify-center lg:items-center bg-stone-100'>
                  {primaryItem.children.map((secondaryItem) => (
                    <div key={secondaryItem.name} className=' lg:p-6 lg:text-lg'>
                      <Link
                        className='flex px-4 py-2 block text-lg p-4 text-orange-500 border-t border-t-neutral-300 lg:border-0'
                        href={secondaryItem.url}
                        target={secondaryItem.target || '_self'}
                      >
                        {getIcon(secondaryItem.name)}
                        {secondaryItem.name}
                      </Link>

                      {secondaryItem.children && (
                        <div className='sm:flex lg:block'>
                          {secondaryItem.children.map((tertiaryItem) => (
                            <div key={tertiaryItem.name}>
                              <Link className='px-4 py-2 block text-lg p-4 border-t border-t-neutral-300' href={tertiaryItem.url}>{tertiaryItem.name}</Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </header>

  )
}
