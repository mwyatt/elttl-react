import React from 'react'
import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import DatePretty from '@/components/DatePretty'
import FixtureCard from '@/components/FixtureCard'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import CarouselElttl from '@/components/CarouselElttl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import SubHeading from '@/components/SubHeading'

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

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

  dayjs.extend(relativeTime)

  return (
    <FrontLayout paddedContent={false} maxWidth>
      <div className='md:flex'>
        <div className='md:p-6 flex-1'>
          {/* <CarouselElttl advertisements={advertisementsPrimary} /> */}

          {advertisementsPrimary.map((advertisement) => (
            <div key={advertisement.id} className='p-6 flex-1 bg-orange-500 text-center md:text-left text-white md:rounded'>
              <h2 className='mb-4 text-5xl font-bold'>{advertisement.title}</h2>
              <p className='my-3 text-3xl'>{advertisement.description}</p>
              <div className='mt-6 flex justify-end'>
                <Link
                  className='bg-stone-500 border-b-stone-700 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'
                  href={advertisement.url}
                >{advertisement.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className='flex-1'>
          <div className='flex p-4 items-center'>
            <h2 className='text-2xl grow'>Press Releases</h2>
            <div>
              <Link className='text-gray-500 border-b border-b-gray-400 ,mb' href='/press/'>View all</Link>
            </div>
          </div>
          {latestPress.map((press) => (
            <div className='p-4 border-b border-dashed' key={press.id}>
              <p
                className='text-sm text-gray-500 mb-2'
                title={dayjs.unix(press.timePublished).format('DD/MM/YYYY HH:mm')}
              >{dayjs.unix(press.timePublished).fromNow()}
              </p>
              <h3 className='text-lg text-orange-500'><Link href={press.url}>{press.title}</Link></h3>
            </div>
          ))}
        </div>
      </div>
      {/* <div> */}
      {/*  <SubHeading name={'Rising Stars'} /> */}
      {/*  <p>@todo this can be a list of players who have attained the most rank this season</p> */}
      {/* </div> */}
      <div>
        <h2 className='text-2xl p-4'>Latest Fixtures</h2>
        <div className='flex flex-wrap gap-3 mb-6 p-4'>
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
      <div className='hidden'>
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
      <div className='p-4 flex flex-col md:flex-row gap-4'>
        {advertisementsSecondary.map((advertisement, index) => (
          <div key={index} className='p-4 bg-orange-500 text-white rounded bg-[url(/table-lip.png)] bg-right-bottom bg-no-repeat flex-basis-1/3 md:basis-1/3'>
            <h2 className='mb-4 text-2xl font-bold'>{advertisement.title}</h2>
            <p className='my-3 text-lg'>{advertisement.description}</p>
            <div className='mt-6 flex justify-end'>
              {advertisement.action && (
                <Link
                  className='bg-gray-600 rounded-sm px-3 py-2 text-white font-bold capitalize'
                  href={advertisement.url}
                >{advertisement.action}
                </Link>

              )}
            </div>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
