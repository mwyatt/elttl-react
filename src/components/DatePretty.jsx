import dayjs from "dayjs";


export default function DatePretty ({ time }) {
  return (
    <time dateTime={dayjs.unix(time).toISOString()}>
      {dayjs.unix(time).format('DD/MM/YYYY HH:mm')}
    </time>
  )
}
