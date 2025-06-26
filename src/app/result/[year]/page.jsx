import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const year = (await params).year

  const response = await fetch(`${apiUrl}/result/${year}`)
  const data = await response.json()

  return (
    <FrontLayout>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
          ]
        }
      />
      <h2 className='text-2xl mb-4'>Season {year}</h2>
      <p>Here are all the divisions in this season.</p>
      <div className='flex gap-4 mt-8 flex-wrap'>
        {data.map((division) => (
          <Link className='px-6 py-3 border border-primary-500 rounded font-bold' href={`/result/${year}/${division.name.toLowerCase()}`} key={division.name}>
            {division.name} Division
          </Link>
        ))}
      </div>
    </FrontLayout>
  )
}
