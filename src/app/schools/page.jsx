import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import Link from 'next/link'
import { linkStyles } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Schools'),
  description: '@todo'
}

export default async function Page () {
  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Schools' />
        <p className='my-6'>A number of schools in the area actively encourage table tennis and have a table tennis club during or after school.</p>
        <p className='my-6'>If your school is interested in developing table tennis as an activity please contact Harry Rawcliffe on 01254 663451.</p>
        <p className='my-6'>We are happy to speak to table tennis enthusiasts from primary or secondary schools in either the mainstream or private sector.</p>
        <p className='my-6'>Please take a look at our <Link href='/sessions' className={linkStyles.join(' ')}>Sessions</Link> page for information on the currently available practice and coaching in the local area.</p>
      </div>
    </FrontLayout>
  )
}
