import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${apiUrl}/result`)
  const data = await response.json()

  return (
    <FrontLayout maxWidth={true}>
      <h2 className='text-2xl mb-4'>Results by Season</h2>
      <p>Here are all the seasons past and present.</p>
      <div className={'flex gap-4 mt-8'}>
        {data.map((season) => (
          <div key={season.name} className='px-6 py-3 border border-orange-500 rounded font-bold'>
            <Link href={`/result/${season.name}`}>{season.name}</Link>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
