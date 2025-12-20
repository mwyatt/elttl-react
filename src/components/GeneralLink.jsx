'use client'

import Link from 'next/link'

export default function GeneralLink ({ ...props }) {
  return (
    <Link {...props} prefetch={false} />
  )
}
