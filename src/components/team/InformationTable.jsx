'use client'

import Link from 'next/link'
import { linkStyles } from '@/lib/styles'

export default function InformationTable ({ yearName, teams }) {
  return (
    <table className='w-full mb-12'>
      <thead>
        <tr>
          <th className='border border-stone-400 p-2'>Team</th>
          <th className='border border-stone-400 p-2'>Venue</th>
          <th className='border border-stone-400 p-2'>Secretary</th>
          <th className='border border-stone-400 p-2'>Contact (L)</th>
          <th className='border border-stone-400 p-2'>Contact (M)</th>
        </tr>
      </thead>
      <tbody>

        {teams.map((team, index) => (
          <tr key={index}>
            <td className='border border-stone-400 p-2'>
              <Link className={linkStyles.join(' ')} href={`/result/${yearName}/team/${team.slug}`}>{team.name}</Link>
            </td>
            <td className='border border-stone-400 p-2'>
              <Link className={linkStyles.join(' ')} href={`/result/${yearName}/venue/${team.venueSlug}`}>{team.venueName}</Link>
            </td>
            <td className='border border-stone-400 p-2'>
              <Link className={linkStyles.join(' ')} href={`/result/${yearName}/player/${team.secretarySlug}`}>{team.secretaryName}</Link>
            </td>
            <td className='border border-stone-400 p-2'>
              <span>{team.secretaryPhoneLandline}</span>
            </td>
            <td className='border border-stone-400 p-2'>
              <span>{team.secretaryPhoneMobile}</span>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}
