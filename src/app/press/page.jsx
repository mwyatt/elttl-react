import FrontLayout from '@/app/frontLayout'
import {apiUrl} from "@/constants/url";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import DatePretty from "@/components/DatePretty";

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
        <Breadcrumbs />
        <h2 className='text-3xl mb-4'>Press Releases</h2>
        <Link href={`/press?page=${prevPage}`} >Previous</Link>
        <Link href={`/press?page=${nextPage}`} >Next</Link>
        {contents.map((content) => (
          <div className='p-4 border-b' key={content.title}>
            <p className='text-sm text-gray-500'>
              <DatePretty time={content.timePublished} />
            </p>
            <h2><Link href={`/press/${content.slug}`}>{content.title}</Link></h2>
            <h3 className='text-lg text-orange-500'>{content.author}</h3>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
