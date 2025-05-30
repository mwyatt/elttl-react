import FrontLayout from '@/app/frontLayout'
import { apiUrl } from '@/constants/url'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import DatePretty from '@/components/DatePretty'
import MainHeading from '@/components/MainHeading'
import { BiCaretLeft, BiCaretRight } from 'react-icons/bi'
import { linkStyles } from '@/lib/styles'

export const dynamic = 'force-dynamic'

export default async function Page ({ params, searchParams }) {
  let { page } = await searchParams
  if (!page) {
    page = 1
  }
  const nextPage = parseInt(page) + 1
  const prevPage = parseInt(page) - 1

  const contents = await fetch(`${apiUrl}/content?type=press&page=${page}`).then((res) => res.json())

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <Breadcrumbs items={
          [
            { name: 'Press Releases' }
          ]
        }
        />
        <MainHeading name='Press Releases' />
        <div className='flex justify-between my-6'>
          <Link className='flex items-center border border-orange-500 text-orange-500 py-1 pr-3 pl-2 rounded' href={`/press?page=${prevPage}`}>
            <BiCaretLeft size={21} className='mr-1' />
            Previous
          </Link>
          <Link className='flex items-center border border-orange-500 text-orange-500 py-1 pr-2 pl-3 rounded' href={`/press?page=${nextPage}`}>
            Next
            <BiCaretRight size={21} className='ml-2' />
          </Link>
        </div>
        {contents.map((content, index) => (
          <div className='p-4 border-b' key={index}>
            <p className='text-sm text-gray-500 mb-2'>
              <DatePretty time={content.timePublished} />
            </p>
            <h2><Link className={linkStyles.join(' ')} href={`/press/${content.slug}`}>{content.title}</Link></h2>
            <h3 className='mt-2'>{content.author}</h3>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
