import { WeekConfigurator } from '@/components/admin/week/WeekConfigurator'
import { cookies } from 'next/headers'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const cookiePromise = await cookies()
  const cookie = cookiePromise.get('session')?.value

  const response = await adminApiFetch(`/week`)
  const { divisions, weeks, fixtures } = await response.json()

  return (
    <WeekConfigurator cookie={cookie} divisions={divisions} weeks={weeks} fixtures={fixtures} />
  )
}
