import React from 'react'
import Link from 'next/link'
import { getMetaTitle } from '@/constants/MetaData'
import { BiLogoFacebook } from 'react-icons/bi'
import Header from '@/components/Header'
import Address from '@/components/Address'
import { PiXLogoFill } from 'react-icons/pi'
import { fetchJson } from '@/app/lib/fetchWrapper'
import CookieBanner from '@/components/CookieBanner'
import { cookies } from 'next/headers'
import { CookieBannerConsentChoiceKey } from '@/constants/Cookies'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default async function FrontLayout ({ children, paddedContent = true, maxWidth = true }) {
  const appName = getMetaTitle()
  const {
    menuPrimary,
    footLinks,
    advertisementsSecondary
  } = await fetchJson('/frontend')
  const cookieStore = await cookies()
  const isCookieBannerDismissed = cookieStore.get(CookieBannerConsentChoiceKey)?.value.length > 0

  return (
    <div data-version={process.env.NEXT_CURRENT_VERSION}>
      <Header appName={appName} menuPrimary={menuPrimary} />

      <div className={`${paddedContent ? 'p-4 sm:p-8' : ''} ${maxWidth ? 'max-w-[1440px] mx-auto' : ''} bg-white/80`}>
        {children}
      </div>

      <div>
        <div className='max-w-[1440px] mx-auto flex flex-col md:flex-row'>
          {advertisementsSecondary.map((advertisement, index) => (
            <div key={index} className='p-6 bg-[#8d9584] md:border-r text-white bg-[url(/table-lip.png)] bg-right-bottom bg-no-repeat flex-basis-1/3 md:basis-1/3 border-b border-stone-500 md:border-b-0'>
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

      <footer className='bg-tertiary-500'>
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
            <Link href='http://tabletennisengland.co.uk/' target='_blank' className='inline-block m-2 w-32 h-auto' rel='noreferrer'>
              <Image
                className='block w-20 md:w-32 h-auto' src='https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg' alt='Table Tennnis England logo'
                width={0} height={0}
              />
            </Link>
          </div>
        </div>
      </footer>

      <CookieBanner isCookieBannerDismissed={isCookieBannerDismissed} />
    </div>
  )
}
