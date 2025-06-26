import { adminApiFetch, adminApiUrl } from '@/constants/url'

export const dynamic = 'force-dynamic'

export default async function Page () {
  const response = await adminApiFetch('/season')
  const { currentYear, fixtureStats } = await response.json()

  return (
    <>
      <h2 className='text-2xl p-4'>Season</h2>
      <p className='my-4'>The current year set is <strong>{currentYear.name}</strong> which has an ID of <strong>{currentYear.id}</strong> in the database.</p>
      <p className='my-4'>We currently have <strong>{fixtureStats.total}</strong> fixtures in the database <strong>{fixtureStats.fulfilled}</strong> of which are fulfilled but <strong>{fixtureStats.unfulfilled}</strong> are yet to be.</p>
      <p>Visit {`${adminApiUrl}/season/create`} to Start New Season</p>
      <p className='my-4'>Start a new season by making a copy of all of the current seasons teams and players, then
        creating a new year entry and altering the option table to point to the new year.
      </p>
      <p className='my-4'>Visit {`${adminApiUrl}/season/generate-fixtures`} to Generate Fixtures</p>
      <p className='my-4'>Generate fixtureStats on a fresh season, using all the available teams.</p>
    </>
  )
}
