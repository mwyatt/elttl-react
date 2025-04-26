import { Form } from '@/app/admin/team/[id]/Form'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { id } = (await params)

  const response = await adminApiFetch(`/team/${id}`)
  const { team, divisions } = await response.json()

  return (
    <>
      <h2 className='text-2xl p-4'>{team.name}</h2>

      <Form team={team} divisions={divisions} />
    </>
  )
}
