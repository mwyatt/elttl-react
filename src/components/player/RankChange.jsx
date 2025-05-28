export default function RankChange ({ rankChange }) {
  if (rankChange === null || rankChange === 0) {
    return
  }

  const classNames = [
    'rounded-full p-1 inline-block w-10 h-7 text-center mx-2 text-sm'
  ]

  const getRankChangeText = (change) => {
    if (change < 0) {
      return change
    }
    return `+${change}`
  }

  const getBgColor = (change) => {
    let className = 'border text-green-500 border-green opacity-50'
    if (change < 0) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change < -10) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change < -20) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change < -30) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change < -40) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change < -50) {
      className = 'border border-stone-500 text-stone-500 opacity-50'
    }
    if (change > 0) {
      className = 'border text-green-500 border-green-500 opacity-50'
    }
    if (change > 10) {
      className = 'border text-green-500 border-green-500 opacity-60'
    }
    if (change > 20) {
      className = 'border text-green-500 border-green-500 opacity-70'
    }
    if (change > 30) {
      className = 'border text-green-500 border-green-500 opacity-80'
    }
    if (change > 40) {
      className = 'border text-green-500 border-green-500 opacity-90'
    }
    if (change > 50) {
      className = 'border text-green-500 border-green-500 opacity-100'
    }
    if (change > 60) {
      className = 'border text-green-500 border-green-500'
    }
    return className
  }

  classNames.push(getBgColor(rankChange))

  return (
    <span
      className={classNames.join(' ')}
      title='Players ranking change as a result of this encounter'
    >
      {getRankChangeText(rankChange)}
    </span>
  )
}
