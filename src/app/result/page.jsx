import FrontLayout from "@/app/frontLayout";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/result`);
  const data = await response.json();

  return (
    <FrontLayout>
      <h2 className={'text-2xl mb-4'}>Results by Season</h2>
      <p>Here are all the seasons past and present.</p>
      <div>
        {data.map((season) => (
          <div key={season.name} className={'p-4 border-b'}>
            <Link href={`/result/${season.name}`}>{season.name}</Link>
          </div>
        ))}
      </div>
    </FrontLayout>
  );
}