import FrontLayout from '@/app/frontLayout'
import Address from '@/components/Address'
import DirectionsButton from '@/components/DirectionsButton'
import MainHeading from '@/components/MainHeading'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import SubHeading from '@/components/SubHeading'
import { DeveloperEmail } from '@/constants/MetaData'

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
        </div>
        <div className='flex-1'>
          <div className='pb-12 mb-12 border-b border-stone-300 border-dashed'>
            <SubHeading name='League Secretary' />
            <h3 className=''>David Heys - 01254 608565</h3>

          </div>

          <SubHeading name='Website Maintainer' />
          <p>Always open to ideas and criticism of the website so please provide any feedback to <GeneralLink className={linkStyles.join(' ')} href={`mailto:${DeveloperEmail}`}>{DeveloperEmail}</GeneralLink>.</p>
        </div>
      </div>

    </FrontLayout>
  )
}
