'use client'

import Link from 'next/link'
import { DeveloperEmail } from '@/constants/MetaData'
import { linkStyles } from '@/lib/styles'

export default function ImageGallery () {
  return (
    <div className='my-6 px-4 md:px-0'>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>Gallery</h2>
        {/* <Link className='text-gray-500 border-b border-b-gray-400' href='/sessions'>All Sessions</Link> */}
      </div>
      <div className='flex flex-wrap gap-3 mb-6'>
        <p>Want your pics included in the gallery and featured on the homepage? Send them in to <Link className={linkStyles.join(' ')} href={`mailto:${DeveloperEmail}`}>{DeveloperEmail}</Link></p>
      </div>
    </div>
  )
}
