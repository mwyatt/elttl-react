import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import axios from "axios";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const year = (await params).year
  const teamLeftSlug = (await params).teamLeftSlug
  const teamRightSlug = (await params).teamRightSlug

  const response = await fetch(`${apiUrl}/result/${year}/fixture/${teamLeftSlug}/${teamRightSlug}`);
  const data = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>{data.teamLeft.name} vs {data.teamRight.name}</h2>
      <p>Home team venue <Link href={`/result/${year}/venue/${data.venue.slug}`}>{data.venue.name}</Link></p>
      <div>
        {data.encounters.map((row) => (
          <div className={'flex gap-4'}>
            <div className={'p-3 basis-1/4'}>
              <Link href={`/result/${year}/player/${row.playerLeftSlug}`}>
                {row.playerLeftName}
              </Link>
              {row.playerRankChangeLeft}
            </div>
            <div className={'p-3 basis-1/4'}>{row.scoreLeft}</div>
            <div className={'p-3 basis-1/4'}>{row.scoreRight}</div>
            <div className={'p-3 basis-1/4'}>
              <Link href={`/result/${year}/player/${row.playerRightSlug}`}>
                {row.playerRightName}
              </Link>
              {row.playerRankChangeRight}
            </div>
          </div>
        ))}
      </div>
    </FrontLayout>
  );
}