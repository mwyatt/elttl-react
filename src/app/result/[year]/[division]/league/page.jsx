import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import React from 'react';
import {apiUrl} from "@/constants/url";

export const dynamic = 'force-dynamic';

export default async function Page({params}) {
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}/league`);
  const {stats} = await response.json();

  return (
    <FrontLayout>
      <div>
        <Link href={`/result`}>Results</Link>
        <Link href={`/result/${year}}`}>{year}</Link>
      </div>
      <h2 className={'text-2xl mb-4'}><span className={'capitalize'}>{division}</span> Division League Table</h2>
      <p>This is the league table for the Premier division.</p>
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
          <th>Name</th>
          <th>Won</th>
          <th>Draw</th>
          <th>Loss</th>
          <th>Played</th>
          <th>Points</th>
        </tr>
        </thead>
        <tbody>

        {stats.map((stat) => (
          <tr>
            <td className={'border border-amber-400'}>
              <Link href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
            </td>
            <td>{stat.won}</td>
            <td>{stat.draw}</td>
            <td>{stat.loss}</td>
            <td>{stat.played}</td>
            <td>{stat.points}</td>
          </tr>
        ))}

        </tbody>
      </table>
    </FrontLayout>
  );
}