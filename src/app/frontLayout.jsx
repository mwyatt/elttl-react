import React from 'react'
import Link from 'next/link'
import { apiUrl } from '@/constants/url'
import { getMetaTitle } from '@/constants/MetaData'
import { BiLogoFacebook, BiLogoTwitter } from 'react-icons/bi'
import Header from '@/components/Header'
import Address from '@/components/Address'
import { PiXLogoFill } from 'react-icons/pi'
import { linkStyles } from '@/lib/styles'
import { fetchJson } from '@/app/lib/fetchWrapper'

export const dynamic = 'force-dynamic'

export default async function FrontLayout ({ children, paddedContent = true, maxWidth = true }) {
  const auth = { user: null }
  const appName = getMetaTitle()
  const {
    headLinks,
    menuPrimary,
    footLinks,
    advertisementsSecondary
  } = await fetchJson('/frontend')

  return (
    <div className='bg-[url(/bg.gif)] bg-no-repeat'>
      {/* <div className='flex border-b border-neutral-400 text-sm bg-neutral-200'> */}
      {/*  <div className={'max-w-[1440px] mx-auto hidden'}> */}
      {/*    <div className='flex-1 hidden lg:block'> */}
      {/*      {headLinks.map((item) => ( */}
      {/*        <Link */}
      {/*          className='p-2 px-3 text-sm border-r text-neutral-600 border-gray-400 inline-block' key={item.name} */}
      {/*          href={item.url} */}
      {/*        >{item.name} */}
      {/*        </Link> */}
      {/*      ))} */}
      {/*    </div> */}
      {/*  </div> */}
      {/*  <div className='flex'> */}
      {/*    {auth.user */}
      {/*      ? ( */}
      {/*        <Link */}
      {/*          className='p-2' */}
      {/*          href='/account/' */}
      {/*        > */}
      {/*          My Account */}
      {/*        </Link> */}
      {/*        ) */}
      {/*      : ( */}
      {/*        <div className='hidden'> */}
      {/*          <Link */}
      {/*            className='p-2' */}
      {/*            href='/login/' */}
      {/*          > */}
      {/*            Log in */}
      {/*          </Link> */}
      {/*          <Link */}
      {/*            className='p-2' */}
      {/*            href='/register/' */}
      {/*          > */}
      {/*            Register */}
      {/*          </Link> */}
      {/*        </div> */}
      {/*        )} */}
      {/*  </div> */}
      {/* </div> */}

      <Header appName={appName} menuPrimary={menuPrimary} />

      <div className={`${paddedContent ? 'p-4 sm:p-8' : ''} ${maxWidth ? 'max-w-[1440px] mx-auto' : ''} bg-white/20`}>
        {children}
      </div>

      <div>
        <div className='max-w-[1440px] mx-auto p-4 flex flex-col md:flex-row gap-4'>
          {advertisementsSecondary.map((advertisement, index) => (
            <div key={index} className='p-4 bg-tertiary-500 text-white rounded bg-[url(/table-lip.png)] bg-right-bottom bg-no-repeat flex-basis-1/3 md:basis-1/3'>
              <h2 className='mb-4 text-2xl font-bold'>{advertisement.title}</h2>
              <p className='my-3 text-lg'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                {advertisement.action && (
                  <Link
                    className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize'
                    href={advertisement.url}
                    target='_blank' rel='noreferrer'
                  >{advertisement.action}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className='bg-tertiary-500 mt-8'>
        <div className='md:flex max-w-[1440px] mx-auto'>
          <div className='basis-1/4 p-4 text-white'>
            <div className='mb-1'><Link href='/contact-us' className='underline font-bold'>&copy; {appName}</Link></div>
            <Address />
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 1).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  href={item.url}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 2).map((item) => (
                <Link
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  href={item.url}
                  target={item.target || '_self'}
                >{item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 mt-4'>
            <Link href='https://x.com/eastlancstt' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <PiXLogoFill size={30} />
            </Link>
            <Link href='https://www.facebook.com/pages/East-Lancashire-Table-Tennis-League/118206128284149' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <BiLogoFacebook size={30} />
            </Link>
            <Link href='http://tabletennisengland.co.uk/' target='_blank' className='inline-block m-2 w-32' rel='noreferrer'>
              <img className='block w-20 md:w-32' src='https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg' alt='Table Tennnis England logo' />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
