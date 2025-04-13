import FrontLayout from '@/app/frontLayout'
import Link from 'next/link'
import FixtureCard from '@/components/FixtureCard'
import {apiUrl} from "@/constants/url";
import SubHeading from "@/components/SubHeading";
import RankChange from "@/components/player/RankChange";
import MainHeading from "@/components/MainHeading";

export const dynamic = 'force-dynamic'

export default async function Page ({ params }) {
  const { year, slug } = await params

  const response = await fetch(`${apiUrl}/result/${year}/player/${slug}`)
  const { player, encounters, fixtures } = await response.json()

  return (
    <FrontLayout>
      <MainHeading name={player.name} />

      <SubHeading name={'General Information'} />
      <table className={'w-full border border-stone-500'}>
        <tbody>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Team</th>
            <td className={'p-3 border border-stone-500'}>
              <Link href={`/result/${year}/team/${player.teamSlug}`}>{player.teamName}</Link>
            </td>
          </tr>
          <tr>
            <th className={'p-3 border border-stone-500 bg-stone-400'}>Rank</th>
            <td className={'p-3 border border-stone-500'}>
              {player.rank}
            </td>
          </tr>
        </tbody>
      </table>

      <SubHeading name={'Team Fixtures'} />
      <div className='flex flex-wrap'>

        {fixtures.map((fixture, index) => (
          <FixtureCard
            key={index}
            year={year}
            teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
            teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
            timeFulfilled={fixture.timeFulfilled}
          />
        ))}

      </div>

            <SubHeading name={'Season Performance'} />

      {encounters.map((encounter, index) => (
        <div key={index} className={'flex border-b border-b-stone-500 p-3 gap-4'}>
          <div className={'flex-2'}>
            <Link href={`/result/${year}/player/${encounter.playerLeftSlug}`}>{encounter.playerLeftName}</Link>
            <RankChange rankChange={encounter.playerRankChangeLeft} />
          </div>
          <div className={'flex-1'}>{encounter.scoreLeft}</div>
          <div className={'flex-1'}>{encounter.scoreRight}</div>
          <div className={'flex-2'}>
            <Link href={`/result/${year}/player/${encounter.playerRightSlug}`}>{encounter.playerRightName}</Link>
            <RankChange rankChange={encounter.playerRankChangeRight} />
          </div>
        </div>
      ))}
    </FrontLayout>
  )
}
