import Link from 'next/link'
import { linkStyles } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export default async function Page () {
  return (
    <>
      <h2 className='font-bold text-2xl mb-4 mt-6'>Dashboard</h2>
      <p>Welcome to the admin area.</p>
      <div>
        <div>
          <h3 className='font-semibold text-lg mb-4 mt-6'>Reports</h3>
          <ul className='list-disc list-inside pl-4'>
            <li>
              <Link href='/admin/report/players-playing-up' className={linkStyles.join(' ')}>Players Playing Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
