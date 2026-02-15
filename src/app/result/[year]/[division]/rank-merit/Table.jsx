'use client'

import { useState } from 'react'
import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import { getShortPlayerName } from '@/lib/player'
import { Dialog } from '@headlessui/react'
import { FaQuestionCircle } from 'react-icons/fa'

export default function Table ({ year, stats }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalTitle, setModalTitle] = useState('')

  return (
    <>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='fixed inset-0 flex items-center justify-center'>
        <Dialog.Panel className='p-4 bg-white rounded shadow'>
          <Dialog.Title className='text-lg font-bold'>{modalTitle}</Dialog.Title>
          <div className='overflow-scroll h-96'>
            {modalContent}
          </div>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </Dialog.Panel>
      </Dialog>
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4'>Name</th>
            <th className='p-2 md:p-4'>Team</th>
            <th className='p-2 md:p-4'>Merit</th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
              <td className='p-2 md:p-4'>
                <GeneralLink className={linkStyles.join(' ')} href={`/result/${year}/player/${stat.player.slug}`}>
                  <span className='sm:hidden'>{getShortPlayerName(stat.player.name)}</span>
                  <span className='hidden sm:inline'>{stat.player.name}</span>
                </GeneralLink>
              </td>
              <td className='p-2 hidden sm:block md:p-4'>
                <GeneralLink className={`${linkStyles.join(' ')} text-tertiary-500 border-b-tertiary-500`} href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</GeneralLink>
              </td>
              <td className='p-2 md:p-4 text-center'>
                <div className='flex gap-2'>
                  {stat.totalMerit}
                  <button onClick={() => {
                    setModalTitle(stat.player.name + '\'s Merits')
                    setModalContent(stat.merits.map((merit, index) => {
                      return (
                        <div key={index} className='p-2 border-b flex gap-6'>
                          <p>{merit.description}</p>
                          <p>{merit.merit}</p>
                        </div>
                      )
                    }))
                    setIsOpen(true)
                  }}
                  >
                    <FaQuestionCircle className='text-tertiary-500' />
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}
