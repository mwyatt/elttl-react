import FrontLayout from "@/app/frontLayout";

export const dynamic = 'force-dynamic';

export default async function Page() {
  // @todo
  return (
    <FrontLayout>
      <h2 className={'text-2xl p-4'}>About us</h2>
      <p>hey</p>
    </FrontLayout>
  );
}