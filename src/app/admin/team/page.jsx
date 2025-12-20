import GeneralLink from '@/components/GeneralLink'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/team')
  const { teams } = await response.json()

  return (
    <>
      <h2 className='text-2xl p-4'>Teams</h2>

      {teams.map(team => (
        <p key={team.id}><GeneralLink className='text-primary-500 underline' href={`/admin/team/${team.id}`}>{team.name}</GeneralLink> - {team.divisionName}</p>
      ))}
    </>
  )
}
