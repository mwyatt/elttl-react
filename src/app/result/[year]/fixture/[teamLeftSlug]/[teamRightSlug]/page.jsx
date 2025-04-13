import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import RankChange from "@/components/player/RankChange";
import {apiUrl} from "@/constants/url";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const year = (await params).year
  const teamLeftSlug = (await params).teamLeftSlug
  const teamRightSlug = (await params).teamRightSlug

  const response = await fetch(`${apiUrl}/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`)
  const data = await response.json()

  return (
    <FrontLayout>
      <h2 className='text-2xl mb-4'>{data.teamLeft.name} vs {data.teamRight.name}</h2>
      <p>Home team venue <Link href={`/result/${year}/venue/${data.venue.slug}`}>{data.venue.name}</Link></p>
      <div>
        {data.encounters.map((row, index) => (
          <div key={index} className='flex gap-4'>
            <div className='p-3 basis-1/4'>
              <Link className={'text-orange-500 font-bold border-b border-b-orange-500'} href={`/result/${year}/player/${row.playerLeftSlug}`}>
                {row.playerLeftName}
              </Link>
            </div>
            <RankChange rankChange={row.playerRankChangeLeft} />
            <div className='p-3 basis-1/4'>{row.scoreLeft}</div>
            <div className='p-3 basis-1/4'>{row.scoreRight}</div>
            <div className='p-3 basis-1/4'>
              <Link className={'text-orange-500 font-bold border-b border-b-orange-500'} href={`/result/${year}/player/${row.playerRightSlug}`}>
                {row.playerRightName}
              </Link>
            <RankChange rankChange={row.playerRankChangeRight} />
            </div>
          </div>
        ))}
      </div>
    </FrontLayout>
  )
}
