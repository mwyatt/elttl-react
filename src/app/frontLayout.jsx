import React from 'react'
import GeneralLink from '@/components/GeneralLink'
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

export default async function FrontLayout ({ visitingYearName, children, paddedContent = true, maxWidth = true }) {
  const appName = getMetaTitle()
  const {
    currentYearName,
    menuPrimary,
    footLinks,
    advertisementsSecondary
  } = await fetchJson('/frontend')
  const cookieStore = await cookies()
  const isCookieBannerDismissed = cookieStore.get(CookieBannerConsentChoiceKey)?.value.length > 0
  const isVisitingArchive = currentYearName !== visitingYearName

  return (
    <div data-version={process.env.NEXT_CURRENT_VERSION}>
      <Header appName={appName} menuPrimary={menuPrimary} />

      {isVisitingArchive && (
        <div className='bg-amber-400 text-amber-900 text-center p-4'>
          You are viewing an archived season ({visitingYearName}). For the latest information, please visit the{' '}
          <GeneralLink className='underline font-bold' href={`/result/${currentYearName}/season`}>
            current season ({currentYearName})
          </GeneralLink>.
        </div>
      )}

      <div className={`${paddedContent ? 'p-4 sm:p-8' : ''} ${maxWidth ? 'max-w-[1440px] mx-auto' : ''} bg-white/80`}>
        {children}
      </div>

      <div className='ml-4 mr-4 mb-8 mt-16'>
        <div className='max-w-[1440px] mx-auto flex flex-col md:flex-row gap-4 lg:pl-4 lg:pr-4'>
          {advertisementsSecondary.map((advertisement, index) => (
            <div key={index} className='p-4 bg-stone-300 text-secondary-700 bg-[url(/table-lip.png)] bg-right-bottom bg-no-repeat flex-basis-1/3 md:basis-1/3 rounded'>
              <h2 className='mb-4 text-2xl font-bold'>{advertisement.title}</h2>
              <p className='my-3 text-lg'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                {advertisement.action && (
                  <GeneralLink
                    className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize'
                    href={advertisement.url}
                    target='_blank' rel='noreferrer'
                  >{advertisement.action}
                  </GeneralLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className='bg-tertiary-500'>
        <div className='md:flex max-w-[1440px] mx-auto'>
          <div className='basis-1/4 p-4 text-white'>
            <div className='mb-1'><GeneralLink href='/contact-us' className='underline font-bold'>&copy; {appName}</GeneralLink></div>
            <Address />
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 1).map((item) => (
                <GeneralLink
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  href={item.url}
                >{item.name}
                </GeneralLink>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 p-4'>
            <nav className='bg-secondary-500 rounded'>
              {footLinks.filter((item) => item.area === 2).map((item) => (
                <GeneralLink
                  className='block px-3 py-2 border-b border-dashed border-tertiary-500 hover:bg-tertiary-500 text-white' key={item.name}
                  href={item.url}
                  target={item.target || '_self'}
                >{item.name}
                </GeneralLink>
              ))}
            </nav>
          </div>
          <div className='basis-1/4 mt-4'>
            <GeneralLink href='https://x.com/eastlancstt' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <PiXLogoFill size={30} />
            </GeneralLink>
            <GeneralLink href='https://www.facebook.com/pages/East-Lancashire-Table-Tennis-League/118206128284149' target='_blank' className='p-2 bg-stone-100 rounded-full m-2 inline-block' rel='noreferrer'>
              <BiLogoFacebook size={30} />
            </GeneralLink>
            <GeneralLink href='http://tabletennisengland.co.uk/' target='_blank' className='inline-block m-2 w-32 h-auto' rel='noreferrer'>
              <Image
                className='block w-20 md:w-32 h-auto' src='https://www.tabletennisengland.co.uk/content/themes/table-tennis-england/img/main-logo.svg' alt='Table Tennnis England logo'
                width={0} height={0}
              />
            </GeneralLink>
          </div>
        </div>
      </footer>

      <CookieBanner isCookieBannerDismissed={isCookieBannerDismissed} />
    </div>
  )
}
