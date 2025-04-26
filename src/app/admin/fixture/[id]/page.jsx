import { adminApiFetch } from '@/constants/url'
import { ScoreCardForm } from '@/app/admin/fixture/[id]/ScoreCardForm'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { id } = await params

  const response = await adminApiFetch(`/fixture/${id}`)
  const { fixture, players, encounters } = await response.json()

  return (
    <>
      <h2 className='text-2xl p-4'>Fulfil Scorecard {fixture.id} - {fixture.teamLeftName} vs {fixture.teamRightName}</h2>
      <ScoreCardForm fixture={fixture} players={players} encounters={encounters} />
    </>
  )
}
