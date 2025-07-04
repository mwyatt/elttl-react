import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import dayjs from 'dayjs'
import { homeNightMap } from '@/constants/Team'
import Link from 'next/link'
import { getSessionVenue, sessions } from '@/constants/VenueSessions'
import { fetchJson } from '@/app/lib/fetchWrapper'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'

export const metadata = {
  title: getMetaTitle('Sessions'),
  description: 'Find out about the various sessions available at our venues, including practice times and special events.'
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params, searchParams }) {
  const { currentYear } = await fetchJson(`/general`)
  const now = dayjs()

  const isToday = (day) => {
    const today = now.day()
    return parseInt(day) === today
  }

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Sessions' />
        {Object.entries(sessions).map(([day, venueSessions]) => (
        <div key={day} className={`mb-12 ${isToday(day) ? 'border-primary-500 px-6 pb-4 border-2 rounded' : ''}`}>
          <SubHeading name={homeNightMap[day]} />
            {Object.entries(venueSessions).map(([venueId, times]) => (
              <div key={venueId} className='mb-4'>
                <h3 className='text-lg mb-4'>
                  <Link href={`/result/${currentYear.name}/venue/${getSessionVenue(venueId).slug}`} className={linkStyles.join(' ')}>
                    {getSessionVenue(venueId).name}
                  </Link>
                </h3>
                <ul className='list-disc list-inside pl-5'>
                  {times.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
