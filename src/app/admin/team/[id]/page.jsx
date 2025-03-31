import Link from "next/link";
import {adminApiUrl} from "@/constants/url";
import {Form} from "@/app/admin/team/[id]/Form";

export const dynamic = 'force-dynamic';

export default async function Page({ params}) {
  const {id} = (await params)

  const response = await fetch(`${adminApiUrl}/team/${id}`);
  const {team} = await response.json();

  return (
    <>
      <h2 className={'text-2xl p-4'}>{team.name}</h2>

      <Form team={team} />
    </>
  );
}