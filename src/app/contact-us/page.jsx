import FrontLayout from '@/app/frontLayout'
import Address from '@/components/Address'
import DirectionsButton from '@/components/DirectionsButton'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const hyndburnLink = 'https://maps.app.goo.gl/EwvviMzKi7HQpyom6'

  return (
    <FrontLayout maxWidth>
      <Breadcrumbs
        items={
          [
            { name: 'Contact us' }
          ]
        }
      />

      <MainHeading name='Contact us' />

      <div className='sm:flex gap-16'>
        <div className='flex-1'>

          <div className='my-6'>
            <SubHeading name='Address' />
            <Address />
          </div>
          <div className='my-6'>
            <SubHeading name='Directions' />

            <DirectionsButton url={hyndburnLink} />
          </div>
          <SubHeading name='League Secretary' />
          <h3 className=''>David Heys - 01254 608565</h3>
        </div>
        <div className='flex-1'>
          <SubHeading name='Website Maintainer' />
          <p>Always open to ideas and critisism of the website so please provide any feedback to <Link className={linkStyles.join(' ')} href='mailto:martin.wyatt@gmail.com'>martin.wyatt@gmail.com</Link>.</p>
        </div>
      </div>

    </FrontLayout>
  )
}
