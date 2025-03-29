import Link from "next/link";

export default async function Page() {
    const apiUrl = process.env.NEXT_ADMIN_API_URL;

  const response = await fetch(`${apiUrl}/team`);
  const {teams} = await response.json();

  return (
    <>
      <h2 className={'text-2xl p-4'}>Teams</h2>

  {teams.map(team => (
    <div key={team.id}>
      <h3><Link href={`/admin/team/${team.id}`}>{team.name}</Link></h3>
      <p>{team.divisionId}</p>
    </div>
  ))}
    </>
  );
}