import React from 'react'
import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import FixtureCard from '@/components/FixtureCard'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import dayjs from 'dayjs'
import { allHomeButtonStyles, linkStyles } from '@/lib/styles'
import { fetchJson } from '@/app/lib/fetchWrapper'
import SeasonTotals from '@/components/home/SeasonTotals'
import SessionsToday from '@/components/home/SessionsToday'
import ImageGallery from '@/components/home/ImageGallery'
import RelativeTime from '@/components/RelativeTime'
import ThisWeek from '@/components/home/ThisWeek'
import { WeekTypeLabels } from '@/constants/Week'
import { formatDateWithDayAndSuffixOfMonth } from '@/lib/date'
import { GiTrophyCup } from 'react-icons/gi'
import Panel from '@/components/home/Panel'

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

export const dynamic = 'force-dynamic'

export default async function Page () {
  const {
    latestPress,
    latestFixtures,
    currentYear,
    seasonTotals,
    thisWeek,
    weekFixtures,
    upcomingEventWeek
  } = await fetchJson('/homepage')

  return (
    <FrontLayout paddedContent={false} maxWidth>
      <div className='sm:p-6 sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {upcomingEventWeek && (
          <Panel>
            <div className='flex flex-col items-center justify-center gap-6 h-full'>
              <div className='grow flex gap-4'>
                <div>
                  <GiTrophyCup className='inline mr-1 mb-1 fill-primary-500' size={120} />
                </div>
                <div>
                  <h1 className='text-3xl font-bold mb-4'>{WeekTypeLabels[upcomingEventWeek.type]}</h1>
                  <p className='text-xl grow'>{formatDateWithDayAndSuffixOfMonth(dayjs.unix(upcomingEventWeek.timeStart))}</p>
                </div>
              </div>
              <div className='w-full flex gap-4 justify-end'>
                <GeneralLink className='text-stone-500 border border-stone-400 px-2 py-1 rounded text-lg flex items-center' href={`/result/${currentYear}/season`}>Season Overview</GeneralLink>
                <GeneralLink href={`/result/${currentYear}/week/${upcomingEventWeek.id}`} className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg'>More Info</GeneralLink>
              </div>
            </div>
          </Panel>
        )}
        <Panel>
          <ThisWeek yearName={currentYear} week={thisWeek} fixtures={weekFixtures} />
        </Panel>
        <Panel rowSpan={2}>
          <div className='flex items-center'>
            <h2 className='text-2xl grow'>News Releases</h2>
            <div>
              <GeneralLink className={allHomeButtonStyles} href='/press/'>All News</GeneralLink>
            </div>
          </div>
          {latestPress.map((press) => (
            <div className='py-4 border-b border-dashed' key={press.id}>
              <p
                className='text-sm text-gray-500 mb-2'
                title={dayjs.unix(press.timePublished).format('DD/MM/YYYY HH:mm')}
              >
                <RelativeTime timestamp={press.timePublished} />
              </p>
              <h3 className='text-lg'>
                <GeneralLink
                  className={linkStyles.join(' ')}
                  href={press.url}
                >
                  {press.title}
                </GeneralLink>
              </h3>
            </div>
          ))}
        </Panel>
        <Panel colSpan={2}>
          <SeasonTotals totals={seasonTotals} yearName={currentYear} />
        </Panel>
        <Panel>
          <SessionsToday yearName={currentYear} />
        </Panel>
        <Panel colSpan={2}>
          {latestFixtures.length > 0 && (
            <>
              <h2 className='text-2xl mb-6'>Latest Fulfilled Fixtures</h2>
              <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
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
            </>
          )}
        </Panel>
        <Panel>
          <ImageGallery />
        </Panel>
        <Panel>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Competitions Schedule</h2>
            <p>Find out more about the various competitions being held this season.</p>
            <div className='flex justify-end'>
              <GeneralLink className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg' href='http://localhost:3000/competitions-schedule-2025-2026.pdf'>Download</GeneralLink>
            </div>
          </div>
        </Panel>
        <Panel>
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl'>Welcome to Season 2025</h2>
            <p>Welcome to the new season, download the handbook for fixtures and more.</p>
            <div className='flex justify-end'>
              <GeneralLink className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg' href='http://localhost:3000/handbook-2025-2026.pdf'>Download</GeneralLink>
            </div>
          </div>
        </Panel>
      </div>
    </FrontLayout>
  )
}
