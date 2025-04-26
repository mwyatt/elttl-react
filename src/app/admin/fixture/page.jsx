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
            <th>ID</th>
            <th>Division</th>
            <th>Team Left</th>
            <th>Team Right</th>
            <th>Fulfilled</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map(fixture => (
            <tr key={fixture.id}>
              <td><Link href={`fixture/${fixture.id}`}>{fixture.id}</Link></td>
              <td>{fixture.divisionName}</td>
              <td>{fixture.teamLeftName}</td>
              <td>{fixture.teamRightName}</td>
              <td>{fixture.timeFulfilled ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
