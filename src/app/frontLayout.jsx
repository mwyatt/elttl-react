import React from 'react'
import Link from 'next/link'
import { apiUrl } from '@/constants/url'
import {getMetaTitle} from "@/constants/MetaData";
import {BiLogoFacebook, BiLogoTwitter} from "react-icons/bi";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic'

export default async function FrontLayout ({ children, paddedContent = true, maxWidth = true }) {
  const auth = { user: null }
  const appName = getMetaTitle()
  const response = await fetch(`${apiUrl}/frontend`)
  const data = await response.json()
  const headLinks = data.headLinks
  const menuPrimary = data.menuPrimary
  const footLinks = data.footLinks

  console.log('@todo frontlayout is being called, should it be?')

  return (
    <div>
      {/*<div className='flex border-b border-neutral-400 text-sm bg-neutral-200'>*/}
      {/*  <div className={'max-w-[1440px] mx-auto hidden'}>*/}
      {/*    <div className='flex-1 hidden lg:block'>*/}
      {/*      {headLinks.map((item) => (*/}
      {/*        <Link*/}
      {/*          className='p-2 px-3 text-sm border-r text-neutral-600 border-gray-400 inline-block' key={item.name}*/}
      {/*          href={item.url}*/}
      {/*        >{item.name}*/}
      {/*        </Link>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className='flex'>*/}
      {/*    {auth.user*/}
      {/*      ? (*/}
      {/*        <Link*/}
      {/*          className='p-2'*/}
      {/*          href='/account/'*/}
      {/*        >*/}
      {/*          My Account*/}
      {/*        </Link>*/}
      {/*        )*/}
      {/*      : (*/}
      {/*        <div className='hidden'>*/}
      {/*          <Link*/}
      {/*            className='p-2'*/}
      {/*            href='/login/'*/}
      {/*          >*/}
      {/*            Log in*/}
      {/*          </Link>*/}
      {/*          <Link*/}
      {/*            className='p-2'*/}
      {/*            href='/register/'*/}
      {/*          >*/}
      {/*            Register*/}
      {/*          </Link>*/}
      {/*        </div>*/}
      {/*        )}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <Header menuPrimary={menuPrimary} />

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
            <Link href=''><BiLogoTwitter /></Link>
            <Link href=''><BiLogoFacebook /></Link>
            <Link href=''><img src="https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg" /></Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
