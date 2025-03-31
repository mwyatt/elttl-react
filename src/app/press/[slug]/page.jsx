import FrontLayout from '@/app/frontLayout'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const slug = (await params).slug

  const response = await fetch(`${apiUrl}/press/${slug}`)
  const data = await response.json()

  return (
    <FrontLayout>
      <h2 className='text-2xl mb-4'>{data.title}</h2>
      <p className='mb-4 italic'>Published on {data.timePublished} by {data.author}</p>
      <div dangerouslySetInnerHTML={{ __html: data.html }} />
    </FrontLayout>
  )
}
