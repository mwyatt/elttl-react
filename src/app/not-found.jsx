"use client"

import FrontLayout from "@/app/frontLayout";
import {useRouter} from 'next/navigation'
import Link from "next/link";

export default function NotFound() {
  const router = useRouter()

  return (
    <FrontLayout>
      <div className={'flex flex-col items-center py-12'}>
        <h1 className={'text-3xl mb-3 font-bold'}>404 Not Found</h1>
        <p className={'text-lg'}>Sorry, the page you are looking for does not exist.</p>
        <button type="button" className={'p-2 bg-orange-500 rounded'} onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </FrontLayout>
  );
}