import Link from 'next/link'
import { adminApiFetch } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/player')
  const { players } = await response.json()

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <h2 className='text-2xl p-4'>Players</h2>
        <Link className='bg-primary-500 text-white px-2 py-1' href='/admin/player/create'>Create New Player</Link>
      </div>

      {players.map(player => (
        <div key={player.id} className={'flex items-center p-2 border-t border-t-stone-200 hover:bg-stone-100'}>
          <Link className='text-primary-500 underline flex-grow' href={`/admin/player/${player.id}`}>
            {player.nameFirst} {player.nameLast}
          </Link>
          <Link className='bg-stone-500 text-white px-2 py-1' href={`/admin/player/${player.id}`}>
            Edit
          </Link>
        </div>
      ))}
    </>
  )
}
