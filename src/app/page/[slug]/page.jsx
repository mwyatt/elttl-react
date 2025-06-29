import FrontLayout from '@/app/frontLayout'
import DatePretty from '@/components/DatePretty'
import MainHeading from '@/components/MainHeading'
import { fetchJson } from '@/app/lib/fetchWrapper'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const slug = (await params).slug
  const data = await fetchJson(`/content/${slug}?type=page`)

  const getAuthor = (author) => {
    if (!author) {
      return
    }
    return `by ${author}`
  }

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name={data.title} />
        <p className='mb-4 italic'>Published on <DatePretty time={data.timePublished} /> {getAuthor(data.author)}</p>
        <div dangerouslySetInnerHTML={{ __html: data.html }} />
      </div>
    </FrontLayout>
  )
}
