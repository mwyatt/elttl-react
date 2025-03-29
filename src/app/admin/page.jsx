
export default async function Page() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/result`);
  const data = await response.json();

  return (
      <h2 className={'text-2xl p-4'}>Dashboard</h2>
  );
}