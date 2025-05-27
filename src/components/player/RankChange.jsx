export default function RankChange ({ rankChange }) {
  if (rankChange === null || rankChange === 0) {
    return
  }

  const classNames = [
    'rounded-full text-white p-1 inline-block w-10 h-7 text-center mx-2 text-sm'
  ]

  const getBgColor = (change) => {
    let className = 'bg-stone-500 opacity-50'
    if (change < 0) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change < -10) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change < -20) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change < -30) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change < -40) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change < -50) {
      className = 'bg-stone-500 opacity-50'
    }
    if (change > 0) {
      className = 'bg-orange-500 opacity-50'
    }
    if (change > 10) {
      className = 'bg-orange-500 opacity-60'
    }
    if (change > 20) {
      className = 'bg-orange-500 opacity-70'
    }
    if (change > 30) {
      className = 'bg-orange-500 opacity-80'
    }
    if (change > 40) {
      className = 'bg-orange-500 opacity-90'
    }
    if (change > 50) {
      className = 'bg-orange-500 opacity-100'
    }
    if (change > 60) {
      className = 'bg-orange-500'
    }
    return className
  }

  classNames.push(getBgColor(rankChange))

  return (
    <span
      className={classNames.join(' ')}
      title='Players ranking change as a result of this encounter'
    >
      {rankChange}
    </span>
  )
}
