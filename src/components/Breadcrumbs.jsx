import Link from 'next/link'

export default function Breadcrumbs ({ items = [] }) {
  const getLink = (item) => {
    if (item.href) {
      return <Link className='text-primary-500' href={item.href}>{item.name}</Link>
    }
    return <span className='text-stone-400 cursor-auto'>{item.name}</span>
  }
  return (
    <div className='flex pb-4 hidden sm:block'>
      {items.map((item, index) => (
        <span key={index}>
          {getLink(item)}
          <span className='text-stone-400 mx-4'>/</span>
        </span>
      ))}
    </div>
  )
}
