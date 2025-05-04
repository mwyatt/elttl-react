import Link from 'next/link'

export default function Breadcrumbs ({ items = [] }) {
  return (
    <div className='flex pb-4'>
      <Link className='text-orange-500' href='/'>Home</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span className='text-neutral-400 mx-4'>/</span>
          <Link className='text-orange-500' href={item.href}>{item.name}</Link>
        </span>
      ))}
    </div>
  )
}
