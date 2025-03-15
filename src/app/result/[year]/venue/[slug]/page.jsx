import FrontLayout from "@/app/frontLayout";
import Link from "next/link";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {year, slug} = await params

  const response = await fetch(`${apiUrl}/result/${year}/venue/${slug}`);
  const data = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>{data.venue.name}</h2>
      <p>{data.venue.location}</p>
              <h2 className={'text-2xl p-4'}>Teams playing at this venue</h2>
        <div className={'flex flex-wrap'}>

      {data.teams.map((team) => (
            <Link href={`/result/${year}/team/${team.slug}`}
                className={'m-2 p-4 border border-orange-500 text-orange-500 min-w-64 rounded-sm'}
                key={team.slug}>
              <span className={'float-right text-gray-500 text-sm'}>{team.divisionName}</span>
              <div>{team.name}</div>
            </Link>
      ))}

      </div>
    </FrontLayout>
  );
}