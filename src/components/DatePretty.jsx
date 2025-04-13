export default function DatePretty ({ time }) {
  const date = new Date(parseInt(time + '000'))

  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString('en-UK', { day: 'numeric', month: '2-digit', year: 'numeric' })}
    </time>
  )
}
