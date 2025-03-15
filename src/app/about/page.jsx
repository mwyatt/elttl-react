import FrontLayout from "@/app/frontLayout";

export default async function About() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/press`);
  const data = await response.json();
  console.log(data);
  return (
    <FrontLayout>
      <h2 className={'text-2xl p-4'}>About us</h2>
      <p>hey</p>
    </FrontLayout>
  );
}