import { WeekConfigurator } from '@/components/admin/week/WeekConfigurator'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const cookiePromise = await cookies()
  const cookie = cookiePromise.get('session')?.value


  return (
    <WeekConfigurator cookie={cookie} />
  )
}
