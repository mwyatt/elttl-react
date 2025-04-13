import React from 'react'
import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import DatePretty from '@/components/DatePretty'
import FixtureCard from '@/components/FixtureCard'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`)
  const {
    latestPress,
    advertisementsPrimary,
    advertisementsSecondary,
    latestFixtures,
    galleryImages,
    currentYear
  } = await response.json()

  return (
    <FrontLayout paddedContent={false} maxWidth={true}>
      <div className='md:flex'>
        <div className='md:p-6 '>
          {advertisementsPrimary.map((advertisement) => (
            <div key={advertisement.id} className='p-6 flex-1 bg-orange-500 text-center md:text-left text-white md:rounded border-b-4 border-b-amber-400'>
              <h2 className='mb-4 text-6xl'>{advertisement.title}</h2>
              <p className='my-3 text-3xl'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                <Link
                  className='bg-stone-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'
                  href={advertisement.url}
                >{advertisement.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className=''>
          <div className='flex justify-end p-2'>
            <Link className='text-gray-500 border-b border-b-gray-400' href='/press/'>View all</Link>
          </div>
          <h2 className='text-2xl p-4'>Press Releases</h2>
          {latestPress.map((press) => (
            <div className='p-4 border-b' key={press.id}>
              <p className='text-sm text-gray-500'>{press.createdAt}</p>
              <h3 className='text-lg text-orange-500'><Link href={press.url}>{press.title}</Link></h3>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className='text-2xl p-4'>Latest Fixtures</h2>
        <div className='flex flex-wrap'>
          {latestFixtures.map((fixture, index) => <FixtureCard
            key={index}
            year={currentYear} teamLeft={{
              name: fixture.teamLeftName,
              slug: fixture.teamLeftSlug
            }}
            teamRight={{
              name: fixture.teamRightName,
              slug: fixture.teamRightSlug
            }}
            timeFulfilled={fixture.timeFulfilled}
                                           />)}
        </div>
      </div>
      <div>
        <h2 className='text-2xl p-4'>Gallery</h2>
        <div className='flex flex-wrap'>
          {galleryImages.map((image, index) => (
            <div key={index} className='overflow-hidden basis-1/5 height-6'>
              <img
                className='w-full'
                src={image.url} alt=''
              />
            </div>
          ))}
        </div>
      </div>
      <div className='md:flex md:gap-4'>
        {advertisementsSecondary.map((advertisement, index) => (
          <div key={index} className='p-4 bg-orange-500 text-white rounded'>
            <h2 className='my-4 text-2xl'>{advertisement.title}</h2>
            <p className='my-3 text-lg'>{advertisement.description}</p>
            <div className='mt-6 flex justify-end'>
              <Link
                className='bg-gray-600 rounded-sm px-3 py-2 text-white font-bold capitalize'
                href={advertisement.url}
              >{advertisement.action}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
