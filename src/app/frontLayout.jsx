import React from 'react'
import Link from 'next/link'
import ElttlEmblem from '@/components/icons/ElttlEmblem'
import MenuPrimary from '@/components/MenuPrimary'
import { apiUrl } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function FrontLayout ({ children, paddedContent = true, maxWidth = true }) {
  const auth = { user: null }
  const appName = 'East Lancashire Table Tennis League'
  const response = await fetch(`${apiUrl}/frontend`)
  const data = await response.json()
  const headLinks = data.headLinks
  const menuPrimary = data.menuPrimary
  const footLinks = data.footLinks

  console.log('@todo frontlayout is being called, should it be?')

  return (
    <div>
      <div className='flex border-b border-neutral-400 text-sm bg-neutral-200'>
        <ul className='flex-1'>
          {headLinks.map((item) => (
            <Link
              className='py-1 px-2 text-sm border-r text-neutral-600 border-gray-400 inline-block' key={item.name}
              href={item.url}
            >{item.name}
            </Link>
          ))}
        </ul>
        <div className='flex'>
          {auth.user
            ? (
              <Link
                className='p-2'
                href='/account/'
              >
                My Account
              </Link>
              )
            : (
              <div className='hidden'>
                <Link
                  className='p-2'
                  href='/login/'
                >
                  Log in
                </Link>
                <Link
                  className='p-2'
                  href='/register/'
                >
                  Register
                </Link>
              </div>
              )}
        </div>
      </div>

      <header className='border-b border-b-slate-300 bg-white drop-shadow-sm'>
        <div className='max-w-[1440px] sm:flex mx-auto border-l border-l-slate-200'>
          <Link
            href='/'
            className='flex-1 flex flex-grow gap-2 sm:gap-4 p-4 items-center justify-center sm:justify-start border-b sm:border-none sm:max-w-[500px]'
          >
            <ElttlEmblem className='sm:hidden' width='50px' />
            <ElttlEmblem className='hidden sm:block' width='75px' />
            <span className=''>
              <span className='hidden sm:block text-4xl'>{appName}</span>
              <span className='sm:hidden text-5xl font-bold'>ELTTL</span>
            </span>
          </Link>
          <MenuPrimary items={menuPrimary} />
        </div>
      </header>

      <div className={`${paddedContent ? 'p-8' : ''} ${maxWidth ? 'max-w-[1440px] mx-auto' : ''}`}>
        {children}
      </div>

      <footer className='bg-stone-500 mt-8'>
        <div className='bg-stone-400 md:flex max-w-[1440px] mx-auto'>
          <div className='basis-1/4 p-4 text-white'>
            <div><Link href='/contact-us' className='text-orange-500 border-b border-b-orange-500'>&copy; {appName}</Link></div>
            Hyndburn Sports Centre<br />
            Henry Street<br />
            Church<br />
            Accrington<br />
            Telephone: 01254 385945
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-stone-600 rounded'>
              {footLinks.filter((item) => item.area === 1).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-stone-500 hover:bg-stone-500 text-white' key={item.name}
                  href={item.url}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-stone-600 rounded'>
              {footLinks.filter((item) => item.area === 2).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-stone-500 hover:bg-stone-500 text-white' key={item.name}
                  href={item.url}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4'>
            <Link href=''>Twitter</Link>
            <Link href=''>Facebook</Link>
            <Link href=''>Table Tennis England</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
