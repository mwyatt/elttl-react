import { apiUrl } from '@/constants/url'
import { notFound } from 'next/navigation'
import { StatusCodes } from 'http-status-codes'

export async function fetchJson (url) {
  const response = await fetch(`${apiUrl}${url}`)

  if (response.status === StatusCodes.NOT_FOUND) {
    notFound()
  }

  return response.json()
}
