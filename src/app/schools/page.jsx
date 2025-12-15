import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import Link from 'next/link'
import { linkStyles } from '@/lib/styles'
import { fetchJson } from '@/app/lib/fetchWrapper'
import { QuickLink } from '@/app/about-us/page'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Schools'),
  description: 'Information for schools interested in developing table tennis as an activity.'
}

export default async function Page () {
  const {
    players,
    currentYearName
  } = await fetchJson('/contacts')

  const getPlayerBySlug = (slug) => {
    return players.find((player) => player.slug === slug)
  }

  const davidHeys = getPlayerBySlug('david-heys')
  const davidHeysLink = <QuickLink href={`/result/${currentYearName}/player/${davidHeys.slug}`} name={davidHeys.name} />

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Schools' />
        <p className='my-6'>A number of schools in the area actively encourage table tennis and have a table tennis club during or after school.</p>
        <p className='my-6'>If your school is interested in developing table tennis as an activity please contact {davidHeysLink}.</p>
        <p className='my-6'>We are happy to speak to table tennis enthusiasts from primary or secondary schools in either the mainstream or private sector.</p>
        <p className='my-6'>Please take a look at our <Link href='/sessions' className={linkStyles.join(' ')}>Sessions</Link> page for information on the currently available practice and coaching in the local area.</p>
      </div>
    </FrontLayout>
  )
}
