import Link from "next/link";
import FrontLayout from "@/app/frontLayout";

export default function NotFound() {
  return (
    <FrontLayout>
      <div className={'flex flex-col items-center py-12'}>
        <h1 className={'text-3xl mb-3 font-bold'}>404 Not Found</h1>
        <p className={'text-lg'}>Sorry, the page you are looking for does not exist.</p>
        <Link href={'/'}>Go Home</Link>
      </div>
      </FrontLayout>
  );
}