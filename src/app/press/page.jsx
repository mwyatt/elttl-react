import FrontLayout from '@/app/frontLayout'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralLink from '@/components/GeneralLink'
import DatePretty from '@/components/DatePretty'
import MainHeading from '@/components/MainHeading'
import { BiCaretLeft, BiCaretRight } from 'react-icons/bi'
import { linkStyles } from '@/lib/styles'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

export const metadata = {
  title: getMetaTitle('Press Releases'),
  description: 'Latest press releases from the league, including news and updates about teams, fixtures, and events.'
}

export const dynamic = 'force-dynamic'

export default async function Page ({ searchParams }) {
  const pageMin = 1
  let { page } = await searchParams
  if (!page || isNaN(page) || parseInt(page) < pageMin) {
    page = pageMin
  }
  const nextPage = parseInt(page) + 1
  let prevPage = parseInt(page) - 1

  if (prevPage < pageMin) {
    prevPage = pageMin
  }

  const contents = await fetchJson(`/content?type=press&page=${page}`)

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
          <GeneralLink className='flex items-center border border-primary-500 text-primary-500 py-1 pr-3 pl-2 rounded' href={`/press?page=${prevPage}`}>
            <BiCaretLeft size={21} className='mr-1' />
            Previous
          </GeneralLink>
          <GeneralLink className='flex items-center border border-primary-500 text-primary-500 py-1 pr-2 pl-3 rounded' href={`/press?page=${nextPage}`}>
            Next
            <BiCaretRight size={21} className='ml-2' />
          </GeneralLink>
        </div>
        {contents.map((content, index) => (
          <div className='p-4 border-b' key={index}>
            <p className='text-sm text-gray-500 mb-2'>
              <DatePretty time={content.timePublished} />
            </p>
            <h2><GeneralLink className={linkStyles.join(' ')} href={`/press/${content.slug}`}>{content.title}</GeneralLink></h2>
            <h3 className='mt-2'>{content.author}</h3>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
