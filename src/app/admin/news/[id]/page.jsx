import { adminApiFetch } from '@/constants/url'
import { cookies } from 'next/headers'
import NewsForm from '@/app/admin/news/[id]/NewsForm'
import { decrypt } from '@/app/lib/session'
import { getUserById } from '@/repository/user'

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { id } = (await params)

  const response = await adminApiFetch(`/news/${id}`)
  const { newsArticle } = await response.json()

  const cookiePromise = await cookies()
  const cookie = cookiePromise.get('session')?.value

  const session = await decrypt(cookie)
  const user = await getUserById(session?.userId)

  return (
    <NewsForm cookie={cookie} newsArticle={newsArticle} user={user} />
  )
}
