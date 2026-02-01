import { adminApiFetch } from '@/constants/url'
import PlayerForm from '@/app/admin/player/[id]/PlayerForm'
import { cookies } from 'next/headers'
import Editor from '@/app/admin/news/[id]/Editor'


export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { id } = (await params)

  // const response = await adminApiFetch(`/player/${id}`)
  // const { player, teams } = await response.json()

  // const cookiePromise = await cookies()
  // const cookie = cookiePromise.get('session')?.value

  return <Editor />
}
