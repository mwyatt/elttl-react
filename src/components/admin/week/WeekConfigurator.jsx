'use client'

import { useEffect, useState } from 'react'
import { WeekTypes } from '@/constants/Week'
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';

export function WeekConfigurator ({ cookie }) {
  const headers = {
    'Content-Type': 'application/json',
    Authentication: cookie
  }
  const [isLoading, setIsLoading] = useState(false)
  const [weeks, setWeeks] = useState([])
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = (
    <Draggable>Drag me</Draggable>
  );

  useEffect(async () => {
    setIsLoading(true)

    const response = await fetch(`/admin/api/week`, {
      method: 'GET',
      headers: headers
    })

    setIsLoading(false)

    const data = await response.json()

    setWeeks(data.weeks)
  }, [])

  const handleCreateWeek = () => {
    const week = {
      id: `fixture-${Math.random().toString(36).substring(2, 15)}`,
      type: WeekTypes.fixture,
      timeCommencing: new Date().toISOString().split('T')[0]
    }
    setWeeks([...weeks, week])
  }

  const handleDragEnd = function(event) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }

  return (
    <>
         <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Droppable>
        {isDropped ? draggableMarkup : 'Drop here'}
      </Droppable>
    </DndContext>


      {isLoading && <div>Loading...</div>}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl p-4'>Weeks</h2>
        <button className='bg-primary-500 text-white px-2 py-1' onClick={handleCreateWeek}>Create New Week</button>
      </div>

      {weeks.map(week => (
        <div key={week.id} className='flex items-center p-2 border-t border-t-stone-200 hover:bg-stone-100'>
          <div>
            {week.type}
          </div>
          <div>
            some kind of body
          </div>
        </div>
      ))}
    </>
  )
}
