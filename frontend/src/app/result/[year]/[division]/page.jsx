import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import React from 'react';
import Breadcrumbs from "nextjs-breadcrumbs";

export default async function Page({params}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}`);
  const {leagueTable, teams} = await response.json();

  const getLeagueTableRow = (teamLeftSlug, teamRightSlug) => {
    for (const row of leagueTable) {
      if (row.teamLeftSlug === teamLeftSlug && row.teamRightSlug === teamRightSlug) {
        return row;
      }
    }
  }

  return (
    <FrontLayout>
      <Breadcrumbs useDefaultStyle rootLabel="Home" />;
      <h2 className={'text-2xl mb-4'}><span className={'capitalize'}>{division}</span> Division</h2>
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
      <table className={'table'}>
        <thead>
        <tr>
          <th></th>

        {teams.map((team) => (
          <th>{team.name}</th>
        ))}

        </tr>
        </thead>

        {teams.map((teamLeft) => (
          <tr>
            <td className={'border border-amber-400'}>{teamLeft.name}</td>
            {teams.map((teamRight) => {
              const leagueTableRow = getLeagueTableRow(teamLeft.slug, teamRight.slug)
              let scoresContent = '';
              if (leagueTableRow) {
                scoresContent = leagueTableRow.scoreLeft + ' - ' + leagueTableRow.scoreRight
              }
              return (
                <td className={'border border-amber-400'}>
                  {scoresContent}
                </td>
              )
            })}
          </tr>
        ))}

      </table>
    </FrontLayout>
  );
}