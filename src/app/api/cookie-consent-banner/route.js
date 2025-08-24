import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { StatusCodes } from 'http-status-codes'
import { CookieBannerConsentChoiceKey } from '@/constants/Cookies'
import dayjs from 'dayjs'

export async function PUT (request, { params }) {
  const { decision } = await request.json()
  const cookieStore = await cookies()
  const expireDate = dayjs().add(6, 'months')

  cookieStore.set(CookieBannerConsentChoiceKey, decision, {
    expires: expireDate.toDate()
  })

  return NextResponse.json({
    message: `Cookie consent banner decision set to ${decision}`
  }, { status: StatusCodes.OK })
}
