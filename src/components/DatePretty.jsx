export default function DatePretty ({ timestampString }) {
  const date = new Date(timestampString)

  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString('en-UK', { day: 'numeric', month: '2-digit', year: 'numeric' })}
    </time>
  )
}
