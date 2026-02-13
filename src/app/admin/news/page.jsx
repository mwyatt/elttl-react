import GeneralLink from '@/components/GeneralLink'
import { adminApiFetch } from '@/constants/url'
import ContentStatus from '@/constants/ContentStatus'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/news')
  const { news } = await response.json()

  return (
    <>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl p-4'>News</h2>
        <GeneralLink className='bg-primary-500 text-white px-2 py-1' href='/admin/news/create'>Create News</GeneralLink>
      </div>

      {news.map(newsItem => (
        <div key={newsItem.id} className='flex items-center p-2 border-t border-t-stone-200 hover:bg-stone-100'>
          <GeneralLink className='text-primary-500 underline flex-grow' href={`/admin/news/${newsItem.id}`}>
            {newsItem.title}
          </GeneralLink>
          <div className='mx-8'>
            {dayjs.unix(newsItem.timePublished).format('DD/MM/YYYY HH:mm')}
          </div>
          <div className='mx-8'>
            {newsItem.status === ContentStatus.PUBLISHED ? 'Published' : 'Unpublished'}
          </div>
          <GeneralLink className='bg-stone-500 text-white px-2 py-1' href={`/admin/news/${newsItem.id}`}>
            Edit
          </GeneralLink>
        </div>
      ))}
    </>
  )
}
