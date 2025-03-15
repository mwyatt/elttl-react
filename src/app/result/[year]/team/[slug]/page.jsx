import FrontLayout from "@/app/frontLayout";
import Link from "next/link";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {year, slug} = await params

  const response = await fetch(`${apiUrl}/result/${year}/team/${slug}`);
  const {team, players} = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>{team.name}</h2>
      <h3 className={'text-2xl mb-4'}>General Information</h3>
      <div>
        <div>Division</div> <Link href={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</Link>
        <div>Home Night</div> {team.homeNight}
        <div>Venue</div> <Link href={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</Link>
        <div>Secretary</div> <Link href={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</Link>
      </div>
              <h2 className={'text-2xl p-4'}>Registered Players</h2>
        <div className={'flex flex-wrap'}>

      {players.map((player) => (
            <Link href={`/result/${year}/player/${player.slug}`}
                className={'m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'}
                key={player.slug}>
              <span className={'float-right text-gray-500 text-sm'}>{player.divisionName}</span>
              <div>{player.name}</div>
            </Link>
      ))}

      </div>
    </FrontLayout>
  );
}