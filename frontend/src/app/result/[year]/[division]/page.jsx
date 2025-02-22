import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import FixtureCard from "@/components/FixtureCard";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}`);
  const data = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>{division} Division</h2>
      <p>This is an overview for the {division} division.</p>
      <div>
        <Link href={`/result/${year}/${division}/league`}>
          League Table
        </Link>
        <Link href={`/result/${year}/${division}/merit`}>
          Merit Table
        </Link>
        <Link href={`/result/${year}/${division}/merit-doubles`}>
          Doubles Merit Table
        </Link>
      </div>
      <div className={'flex flex-wrap gap-2'}>

        {data.map((result) => (
          <FixtureCard year={year} teamLeft={{
            name: result.teamLeftName,
            slug: result.teamLeftSlug,
            score: result.teamLeftScoreTotal,
          }}
                       teamRight={{
                         name: result.teamRightName,
                         slug: result.teamRightSlug,
                         score: result.teamRightScoreTotal,
                       }}
                       timeFulfilled={result.timeFulfilled}/>
        ))}
      </div>
    </FrontLayout>
  );
}