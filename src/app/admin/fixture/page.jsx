import Link from 'next/link'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/fixture')
  const { fixtures } = await response.json()

  return (
    <>
      <h2 className='text-2xl p-4'>Fixtures</h2>
      <table>
        <thead>
          <tr>
            <th className={'p-2'}>ID</th>
            <th className={'p-2'}>Division</th>
            <th className={'p-2'}>Team Left</th>
            <th className={'p-2'}>Team Right</th>
            <th className={'p-2'}>Fulfilled</th>
            <th className={'p-2'}></th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map(fixture => (
            <tr key={fixture.id} className={'border-t border-t-stone-200 hover:bg-stone-100'}>
              <td className={'p-2'}><Link href={`fixture/${fixture.id}`}>{fixture.id}</Link></td>
              <td className={'p-2'}>{fixture.divisionName}</td>
              <td className={'p-2'}>{fixture.teamLeftName}</td>
              <td className={'p-2'}>{fixture.teamRightName}</td>
              <td className={'p-2'}>{fixture.timeFulfilled ? 'Yes' : 'No'}</td>
              <td className={'p-2'}><Link href={`fixture/${fixture.id}`} className={'bg-stone-500 text-white px-2 py-1'}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
