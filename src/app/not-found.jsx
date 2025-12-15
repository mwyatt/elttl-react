import GeneralLink from '@/components/GeneralLink'
import FrontLayout from '@/app/frontLayout'

export const dynamic = 'force-dynamic'

export default function Page () {
  return (
    <FrontLayout>
      <div className='flex flex-col items-center py-12'>
        <h1 className='text-3xl mb-3 font-bold'>404 Not Found</h1>
        <p className='text-lg'>Sorry, the page you are looking for does not exist.</p>
        <GeneralLink className='bg-primary-500 rounded px-5 py-2 text-white font-bold mt-6' href='/'>Go Home</GeneralLink>
      </div>
    </FrontLayout>
  )
}
