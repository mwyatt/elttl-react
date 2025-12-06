import React from 'react'
import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import FixtureCard from '@/components/FixtureCard'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import dayjs from 'dayjs'
import { allHomeButtonStyles, linkStyles } from '@/lib/styles'
import { fetchJson } from '@/app/lib/fetchWrapper'
import SeasonTotals from '@/components/home/SeasonTotals'
import SessionsToday from '@/components/home/SessionsToday'
import ImageGallery from '@/components/home/ImageGallery'
import Image from 'next/image'
import RelativeTime from '@/components/RelativeTime'

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

export const dynamic = 'force-dynamic'

export default async function Page () {
  const {
    latestPress,
    advertisementsPrimary,
    latestFixtures,
    galleryImages,
    currentYear,
    seasonTotals
  } = await fetchJson('/homepage')

  return (
    <FrontLayout paddedContent={false} maxWidth>
      <div className='md:flex'>
        <div className='md:p-6 flex-1 flex flex-col gap-6'>
          {advertisementsPrimary.map((advertisement) => (
            <div
              key={advertisement.id}
              className='p-6 flex-1 bg-tertiary-500 text-center md:text-left text-white md:rounded'
            >
              <h2 className='mb-4 text-5xl font-bold'>{advertisement.title}</h2>
              <p className='my-3 text-3xl'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                <Link
                  className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg'
                  href={advertisement.url}
                >{advertisement.action}
                </Link>
              </div>
            </div>
          ))}

          <SessionsToday yearName={currentYear} />
          <ImageGallery />
        </div>
        <div className='flex-1'>
          <div className='flex p-4 items-center'>
            <h2 className='text-2xl grow'>Press Releases</h2>
            <div>
              <Link className={allHomeButtonStyles} href='/press/'>All Press</Link>
            </div>
          </div>
          {latestPress.map((press) => (
            <div className='p-4 border-b border-dashed' key={press.id}>
              <p
                className='text-sm text-gray-500 mb-2'
                title={dayjs.unix(press.timePublished).format('DD/MM/YYYY HH:mm')}
              >
                <RelativeTime timestamp={press.timePublished} />
              </p>
              <h3 className='text-lg'><Link className={linkStyles.join(' ')} href={press.url}>{press.title}</Link></h3>
            </div>
          ))}
        </div>
      </div>

      <SeasonTotals totals={seasonTotals} yearName={currentYear} />

      {latestFixtures.length > 0 && (
        <div>
          <h2 className='text-2xl p-4'>Latest Fulfilled Fixtures</h2>
          <div className='flex flex-wrap gap-3 mb-6 p-4'>
            {latestFixtures.map((fixture, index) => <FixtureCard
              key={index}
              year={currentYear} teamLeft={{
                name: fixture.teamLeftName,
                slug: fixture.teamLeftSlug,
                score: fixture.scoreLeft
              }}
              teamRight={{
                name: fixture.teamRightName,
                slug: fixture.teamRightSlug,
                score: fixture.scoreRight
              }}
              timeFulfilled={fixture.timeFulfilled}
                                                    />)}
          </div>
        </div>
      )}
      <div className='hidden'>
        <h2 className='text-2xl p-4'>Gallery</h2>
        <div className='flex flex-wrap'>
          {galleryImages.map((image, index) => (
            <div key={index} className='overflow-hidden basis-1/5 height-6'>
              <Image className='w-full' src={image.url} alt='' />
            </div>
          ))}
        </div>
      </div>
    </FrontLayout>
  )
}
