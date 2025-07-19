import { Geist, Geist_Mono, Noto_Kufi_Arabic, Noto_Sans_Javanese, Open_Sans } from 'next/font/google'
import './globals.css'
import { getMetaDescription, getMetaTitle } from '@/constants/MetaData'
import { GoogleTagManager } from '@next/third-parties/google'
import Environments from '@/constants/Environments'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
})

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: '--font-noto-kufi-arabic',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
})

const notoSansJavanese = Noto_Sans_Javanese({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})

export const metadata = {
  title: getMetaTitle(),
  description: getMetaDescription()
}

const isLiveEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT === Environments.LIVE
const gtmContainerId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID

export default function RootLayout ({ children }) {
  return (
    <html lang="en">

    {isLiveEnvironment && gtmContainerId && (
      <GoogleTagManager gtmId={gtmContainerId}/>
    )}

    <body
      className="antialiased"
    >
    {children}
    </body>
    </html>
  )
}
