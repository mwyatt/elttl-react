import FrontLayout from '@/app/frontLayout'
import { apiUrl } from '@/constants/url'
import DatePretty from '@/components/DatePretty'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'

export async function generateMetadata (
  { params }
) {
  const slug = (await params).slug

  const response = await fetch(`${apiUrl}/content/${slug}?type=press`)
  const data = await response.json()

  return {
    title: getMetaTitle(data.title),
    description: data.title
  }
}

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const slug = (await params).slug
  const data = await fetchJson(`/content/${slug}?type=press`)

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <Breadcrumbs items={
          [
            { name: 'Press Releases', href: '/press' },
            { name: data.title, href: `/press/${slug}` }
          ]
        }
        />
        <h2 className='text-3xl mb-4'>{data.title}</h2>
        <p className='mb-4 text-stone-400'>
          Published <DatePretty time={data.timePublished} />
          {data.author && (
            ' by ' + data.author
          )}
        </p>
        <div className='text-base/7 text-stone-600' dangerouslySetInnerHTML={{ __html: data.html }} />
      </div>
    </FrontLayout>
  )
}
