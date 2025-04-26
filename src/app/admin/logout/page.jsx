import { adminApiFetch } from '@/constants/url'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/logout')

  const { success } = await response.json()

  if (success) {
    redirect('/')
  } else {
    redirect('/admin')
  }
}
