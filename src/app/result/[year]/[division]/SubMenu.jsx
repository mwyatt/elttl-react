import GeneralLink from '@/components/GeneralLink'

export default function SubMenu ({ year, division }) {
  return (
    <div className='sm:flex items-center justify-center border border-primary-500 rounded my-6'>
      <GeneralLink className='block p-4 text-primary-500 font-bold sm:border-r border-primary-500' href={`/result/${year}/${division}/league`}>
        League Table
      </GeneralLink>
      <GeneralLink className='block p-4 text-primary-500 font-bold border-t sm:border-t-0 sm:border-r border-primary-500' href={`/result/${year}/${division}/merit`}>
        Merit Table
      </GeneralLink>
      <GeneralLink className='block p-4 text-primary-500 font-bold border-t sm:border-t-0 border-primary-500' href={`/result/${year}/${division}/doubles-merit`}>
        Doubles Merit Table
      </GeneralLink>
    </div>
  )
}
