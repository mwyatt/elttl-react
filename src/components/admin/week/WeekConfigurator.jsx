'use client'

import { useEffect, useState } from 'react'
import { WeekTypes } from '@/constants/Week'
import { DndContext } from '@dnd-kit/core'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isoWeek);
dayjs.extend(utc);

export function WeekConfigurator ({ cookie, divisions, weeks, fixtures }) {

  const headers = {
    'Content-Type': 'application/json',
    Authentication: cookie
  }
  const [isLoading, setIsLoading] = useState(false)
  const [currentDivisionId, setCurrentDivisionId] = useState(divisions[0].id)
  const [weekRange, setWeekRange] = useState({ start: null, end: null })
  const [stateWeeks, setWeeks] = useState([
    // { id: 1, type: WeekTypes.fixture, timeStart: dayjs().unix() },
    // { id: 2, type: WeekTypes.fred0, timeStart: dayjs().add(7, 'day').unix() },
    // { id: 3, type: WeekTypes.fixture, timeStart: dayjs().add(14, 'day').unix() },
  ])
  const [stateFixtures, setFixtures] = useState(fixtures)

  console.log(weekRange)
  console.log(dayjs().isoWeek(49).isoWeekYear(2025).closest('Monday').utc().format())
    // .startOf('isoWeek').utc().unix()
  // )

  const getDraggableFixtures = () => {
    const draggables = []

    stateFixtures.forEach(fixture => {
      if (fixture.weekId === null && fixture.divisionId === currentDivisionId) {
        draggables.push(<Draggable key={fixture.id} id={fixture.id}>
          <div className="border border-stone-300 p-1 m-2 text-sm">
            {fixture.fullName}
          </div>
        </Draggable>)
      }
    })

    return draggables
  }

  const getDroppedFixtures = (weekId) => {
    return stateFixtures.map(fixture => {
      if (fixture.weekId === weekId) {
        return <Draggable key={fixture.id} id={fixture.id}>
          <div className="border border-stone-300 p-2 m-2">
            {fixture.fullName}
          </div>
        </Draggable>
      }
      return null
    })
  }

  const handleSave = () => {
  //   @todo store weeks and fixtures weekId
  }

  const handleGenerateWeeks = () => {
    const week = {
      id: `fixture-${Math.random().toString(36).substring(2, 15)}`,
      type: WeekTypes.fixture,
      timeCommencing: new Date().toISOString().split('T')[0]
    }
    setWeeks([...weeks, week])
  }

  const handleChangeWeekRange = function (key, value) {
    setWeekRange((prev) => {
      return { ...prev, [key]: value}
    })
  }

  const handleDragEnd = function (event) {
    setFixtures((prevFixtures) => {
      return prevFixtures.map((fixture) => {
        if (fixture.id === event.active.id) {
          return {
            ...fixture,
            weekId: event.over ? event.over.id : null
          }
        }
        return fixture
      })
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>

      {isLoading && <div>Loading...</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl p-4">Weeks</h2>
        <input type={"week"} name={"weekStart"} className="border border-stone-300 p-2 m-2 text-sm" onChange={(e) => handleChangeWeekRange('start', e.target.value)} value={weekRange.start} />
        <input type={"week"} name={"weekEnd"} className="border border-stone-300 p-2 m-2 text-sm" onChange={(e) => handleChangeWeekRange('end', e.target.value)} value={weekRange.end} />
        <button className="bg-primary-500 text-white px-2 py-1" onClick={handleGenerateWeeks}>Generate Weeks
        </button>
      </div>
      <div className={'flex'}>
        <div>
          <div>
            <select name="division" id="division" className="border border-stone-300 p-2 m-2" value={currentDivisionId}>
            {divisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
            ))}
            </select>
          </div>
          <div>
            {getDraggableFixtures()}
          </div>
        </div>
        <div className="flex">

          {stateWeeks.map(week => (
            <div key={week.id} className="flex flex-col items-center p-4 border border-stone-300">
              <div>
                {dayjs.unix(week.timeStart).format('DD/MM/YYYY')}
              </div>
              <div>
                <select name="weekType" id="weekType" className="border border-stone-300 p-2 m-2" value={week.type}>
                  {Object.entries(WeekTypes).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              {week.type === WeekTypes.fixture && (
                <Droppable week={week}>
                  {getDroppedFixtures(week.id)}
                </Droppable>
              )}
            </div>
          ))}

        </div>
      </div>
    </DndContext>
  )
}
