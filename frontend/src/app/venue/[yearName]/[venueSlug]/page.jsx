import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import axios from "axios";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const yearName = (await params).yearName
  const venueSlug = (await params).venueSlug

  const response = await axios.get(`${apiUrl}/venue`, {
    params: {
      venueSlug: venueSlug,
      yearName: yearName,
    }
  });

  const data = response.data;

  return (
    <FrontLayout>
      <p>@todo breadcrumbs!</p>
      <h2 className={'text-2xl mb-4'}>{data.venue.name}</h2>
      <p>{data.venue.location}</p>
      <h3>Teams</h3>
      {data.teams.map((team) => (
        <Link href={`/result/${yearName}/team/${team.slug}`} key={team.name}>
          {team.name}
        </Link>
      ))}

      <div>
      </div>
    </FrontLayout>
  );
}