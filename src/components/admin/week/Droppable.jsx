import React from 'react'
import { useDroppable } from '@dnd-kit/core'

function Droppable (props) {
  const week = props.week
  const { isOver, setNodeRef } = useDroppable({
    id: week.id
  })
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}

export { Droppable }
