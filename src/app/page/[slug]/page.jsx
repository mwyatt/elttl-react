import FrontLayout from '@/app/frontLayout'
import {apiUrl} from "@/constants/url";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const slug = (await params).slug

  const response = await fetch(`${apiUrl}/content/${slug}?type=page`)
  const data = await response.json()

  return (
    <FrontLayout>
      <div className={'max-w-[768px] mx-auto'}>
      <h2 className='text-2xl mb-4'>{data.title}</h2>
      <p className='mb-4 italic'>Published on {data.timePublished} by {data.author}</p>
      <div dangerouslySetInnerHTML={{ __html: data.html }} />
      </div>
    </FrontLayout>
  )
}
