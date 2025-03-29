import FrontLayout from "@/app/frontLayout";
import Link from "next/link";
import React from 'react';
import {apiUrl} from "@/constants/url";

export default async function Page({params}) {
  const year = (await params).year
  const division = (await params).division

  const response = await fetch(`${apiUrl}/result/${year}/${division}/merit`);
  const {stats} = await response.json();

  return (
    <FrontLayout>
      <div>
        <Link href={`/result`}>Results</Link>
        <Link href={`/result/${year}}`}>{year}</Link>
      </div>
      <h2 className={'text-2xl mb-4'}><span className={'capitalize'}>{division}</span> Division Merit Table</h2>
      <p>This is the merit table for the Premier division.</p>
      <div>
        {/*@todo component it*/}
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
          <th>Team</th>
          <th>Rank</th>
          <th>Won</th>
          <th>Played</th>
          <th>Average</th>
          <th>Encounters</th>
        </tr>
        </thead>
        <tbody>

        {stats.map((stat, index) => (
          <tr key={index}>
            <td className={'border border-amber-400'}>
              <Link href={`/result/${year}/player/${stat.player.slug}`}>{stat.player.name}</Link>
            </td>
            <td className={'border border-amber-400'}>
              <Link href={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
            </td>
            <td>{stat.rank}</td>
            <td>{stat.won}</td>
            <td>{stat.played}</td>
            <td>{stat.average}</td>
            <td>{stat.encounter}</td>
          </tr>
        ))}

        </tbody>
      </table>
    </FrontLayout>
  );
}