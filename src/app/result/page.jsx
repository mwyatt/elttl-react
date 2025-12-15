import FrontLayout from '@/app/frontLayout'
import GeneralLink from '@/components/GeneralLink'
import { fetchJson } from '@/app/lib/fetchWrapper'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const data = await fetchJson('/result')

  return (
    <FrontLayout maxWidth>
      <h2 className='text-2xl mb-4'>Results by Season</h2>
      <p>Here are all the seasons past and present.</p>
      <div className='flex gap-4 mt-8 flex-wrap text-center'>
        {data.map((season) => (
          <GeneralLink href={`/result/${season.name}`} key={season.name} className='px-6 py-3 border border-primary-500 rounded font-bold flex-grow flex-basis-24'>
            {season.name}
          </GeneralLink>
        ))}
      </div>
    </FrontLayout>
  )
}
