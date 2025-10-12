import Link from 'next/link'
import { linkStyles } from '@/lib/styles'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/report/players-playing-up')
  const { playingUps, yearName } = await response.json()

  return (
    <>
      <h2 className='font-bold text-2xl mb-4 mt-6'>Players Playing Up</h2>
      <p>This report outlines all the players who have played within a different team this season.</p>
      <table className='my-6'>
        <thead>
          <tr>
            <td className='p-2 border border-stone-300'>Fixture ID</td>
            <td className='p-2 border border-stone-300'>Player Name</td>
            <td className='p-2 border border-stone-300'>Team Name</td>
          </tr>
        </thead>
        <tbody>
          {playingUps.map((playingUp, index) => (

            <tr className='my-2' key={index}>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} href={`/admin/fixture/${playingUp.fixtureId}`} rel='noreferrer'>{playingUp.fixtureId}</Link>
              </td>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} href={`/admin/player/${playingUp.player.id}`} rel='noreferrer'>{playingUp.player.name}</Link>
              </td>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} href={`/result/${yearName}/team/${playingUp.team.slug}`} rel='noreferrer'>{playingUp.team.name}</Link>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}
