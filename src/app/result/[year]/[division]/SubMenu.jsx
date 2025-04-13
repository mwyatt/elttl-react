import Link from "next/link";

export default function SubMenu ({ year, division  }) {
  return (
          <div className={'flex items-center justify-center border border-orange-500 rounded my-6'}>
        <Link className={'p-4 text-orange-500 font-bold border-r border-r-orange-500'} href={`/result/${year}/${division}/league`}>
          League Table
        </Link>
        <Link className={'p-4 text-orange-500 font-bold border-r border-r-orange-500'} href={`/result/${year}/${division}/merit`}>
          Merit Table
        </Link>
        <Link className={'p-4 text-orange-500 font-bold border-r'} href={`/result/${year}/${division}/doubles-merit`}>
          Doubles Merit Table
        </Link>
      </div>
  )
}
