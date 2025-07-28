import './globals.css'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import Environments from '@/constants/Environments'
import { GoogleAnalytics } from '@next/third-parties/google'
import { cookies } from 'next/headers'
import { CookieBannerConsentChoiceKey } from '@/constants/Cookies'

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

const isLiveEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT === Environments.LIVE
const gaMeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

export default async function RootLayout ({ children }) {
  const cookieStore = await cookies()
  const isCookieConsented = cookieStore.get(CookieBannerConsentChoiceKey)?.value === 'true'
  const googleAnalyticsIsEnabled = isLiveEnvironment && gaMeasurementId && isCookieConsented

  return (
    <html lang="en">

    {googleAnalyticsIsEnabled && (
      <GoogleAnalytics gaId={gaMeasurementId}/>
    )}

    <body
      className="antialiased"
    >
    {children}
    </body>
    </html>
  )
}
