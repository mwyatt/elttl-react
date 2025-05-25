import FrontLayout from '@/app/frontLayout'
import { apiUrl } from '@/constants/url'
import DatePretty from "@/components/DatePretty";
import MainHeading from "@/components/MainHeading";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const slug = (await params).slug

  const response = await fetch(`${apiUrl}/content/${slug}?type=page`)
  const data = await response.json()

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
