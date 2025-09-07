'use client'

import { useRef, useState } from 'react'
import Feedback from '@/components/Feedback'
import FullLoader from '@/components/FullLoader'
import Link from 'next/link'

export default function PlayerForm ({ cookie, adminApiUrl, player, teams }) {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [playerData, setPlayerData] = useState(player)
  const isCreate = playerData.id === 'create'
  const formRef = useRef(null)

  const handleSubmit = async (event) => {
    setIsLoading(true)
    event.preventDefault()

    const response = await fetch(`${adminApiUrl}/player/${playerData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authentication: cookie
      },
      body: JSON.stringify({
        player: playerData
      })
    })

    const data = await response.json()

    setFeedbackMessage(data.message)
    setIsLoading(false)
    setPlayerData(data.player)
  }

  const handleChange = async (event) => {
    const { name, value } = event.target
    setPlayerData({
      ...playerData,
      [name]: value
    })
  }

  return (
    <>
      <Feedback message={feedbackMessage} />
      <FullLoader isLoading={isLoading} />
      <Link className='bg-stone-500 text-white px-2 py-1' href='/admin/player'>
        Back
      </Link>
      <h2 className='text-2xl p-4'>{player.name}</h2>
      <form className='flex flex-col gap-2 max-w-[500px]' ref={formRef} onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>First Name</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.nameFirst} name='nameFirst' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Last Name</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.nameLast} name='nameLast' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Slug</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.slug} name='slug' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Rank</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.rank} name='rank' required />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Landline</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.phoneLandline} name='phoneLandline' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Mobile</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.phoneMobile} name='phoneMobile' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>ETTA License Number</div>
            <input className='border border-tertiary-500 p-2' type='text' onChange={handleChange} value={playerData.ettaLicenseNumber} name='ettaLicenseNumber' />
          </div>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Team</div>
            <select className='border border-tertiary-500 p-2' name='teamId' onChange={handleChange} value={playerData.teamId} required>
              <option key={0}>
                Choose a team
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          disabled={isLoading}
          type='submit' className='w-32 bg-primary-500 border-b-orange-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-orange-600'
        >
          {isCreate ? 'Create' : 'Update'}
        </button>
      </form>
    </>
  )
}
