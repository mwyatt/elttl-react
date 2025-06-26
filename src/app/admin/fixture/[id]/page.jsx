import { adminApiFetch } from '@/constants/url'
import { ScoreCardForm } from '@/app/admin/fixture/[id]/ScoreCardForm'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { id } = await params

  const response = await adminApiFetch(`/fixture/${id}`)
  const { fixture, players, encounters } = await response.json()

  const cookiePromise = await cookies()
  const cookie = cookiePromise.get('session')?.value

  return (
    <>
      <h2 className='text-2xl p-4'>Fulfil Scorecard {fixture.id} - {fixture.teamLeftName} vs {fixture.teamRightName}</h2>
      <ScoreCardForm fixture={fixture} players={players} encounters={encounters} cookie={cookie} adminApiUrl={process.env.NEXT_ADMIN_API_URL} />
    </>
  )
}
