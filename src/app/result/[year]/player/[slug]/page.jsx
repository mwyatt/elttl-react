import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import FixtureCard from "@/components/FixtureCard";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {year, slug} = await params

  const response = await fetch(`${apiUrl}/result/${year}/player/${slug}`);
  const {player, encounters, fixtures} = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>{player.name}</h2>
      <h3 className={'text-2xl mb-4'}>General Information</h3>
      <div>
        <div>Team</div> <Link href={`/result/${year}/team/${player.teamSlug}`}>{player.teamName}</Link>
        <div>Rank</div> {player.rank}
      </div>
            <h2 className={'text-2xl p-4'}>Team Fixtures</h2>
        <div className={'flex flex-wrap'}>

      {fixtures.map((fixture) => (
        <FixtureCard
          year={year}
          teamLeft={{name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft}}
          teamRight={{name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight}}
        />
      ))}

      </div>
            <h2 className={'text-2xl p-4'}>Season Performance</h2>

            {encounters.map((encounter, index) => (
              <div key={index}>
                <div>
                  <Link href={`/result/${year}/player/${encounter.playerLeftSlug}`}>{encounter.playerLeftName}</Link>
                  {encounter.playerRankChangeLeft}
                </div>
                <div>{encounter.scoreLeft}</div>
                <div>{encounter.scoreRight}</div>
                <div>
                  <Link href={`/result/${year}/player/${encounter.playerRightSlug}`}>{encounter.playerRightName}</Link>
                  {encounter.playerRankChangeRight}
                </div>
              </div>
      ))}
    </FrontLayout>
  );
}