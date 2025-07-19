import './globals.css'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import Environments from '@/constants/Environments'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

const isLiveEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT === Environments.LIVE
const gaMeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

export default function RootLayout ({ children }) {
  return (
    <html lang="en">

    {isLiveEnvironment && gaMeasurementId && (
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
