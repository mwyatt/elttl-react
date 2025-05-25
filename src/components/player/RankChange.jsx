
// @todo coulourise ranks based on how successful the change was
export default function RankChange ({ rankChange }) {
  if (rankChange === null) {
    return;
  }
  return (
    <span
      className='rounded-full bg-orange-500 text-white p-1 inline-block w-8 h-8 text-center font-bold mx-2'
      title='Players ranking change as a result of this encounter'
    >
      {rankChange}
    </span>
  )
}
