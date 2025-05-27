import FrontLayout from '@/app/frontLayout'
import Address from '@/components/Address'

export const dynamic = 'force-dynamic'

export default async function Page () {
  return (
    <FrontLayout maxWidth>
      <h2 className='text-2xl mb-4'>Contact us</h2>
      <Address />
      <p>
        {/* @todo replace with just a link? */}
        <iframe className='google-map my-4' width='100%' height='250' src='https://www.google.com/maps/embed/v1/place?key=&amp;q=Hyndburn Sports Centre' />
      </p>
      <h3>League Secretary - David Heys</h3>
      <p>01254 608565</p>
    </FrontLayout>
  )
}
