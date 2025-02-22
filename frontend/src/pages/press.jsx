"use client"

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import FrontLayout from "@/app/frontLayout";
import Link from "next/link";

export default function Press() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [press, setPress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/press`);
        setPress(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <FrontLayout>
      <h2 className={'text-2xl p-4'}>Press Releases</h2>
      {press.map((article) => (
        <div className={'p-4 border-b'} key={article.id}>
          <p className={'text-sm text-gray-500'}>{article.timePublished}</p>
          <h3 className={'text-lg text-orange-500'}><Link href="123/">{article.title}</Link></h3>
        </div>
      ))}
    </FrontLayout>
  );
}