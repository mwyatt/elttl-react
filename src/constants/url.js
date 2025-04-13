import { cookies } from 'next/headers'

export const adminApiUrl = process.env.NEXT_ADMIN_API_URL

export const apiUrl = process.env.NEXT_PUBLIC_API_URL

export async function adminApiFetch (url) {
  const cookiePromise = await cookies()
  const cookie = cookiePromise.get('session')?.value

  return await fetch(`${adminApiUrl}${url}`, {
    headers: {
      'Authentication': cookie,
    }
  })
}