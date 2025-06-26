'use client'

export default async function Actions () {
  const triggerNewSeason = async () => {
    'use server'

    const newSeasonResponse = adminApiFetch('/season', {
      method: 'POST'
    })
    // if (newSeasonResponse.ok) {
    //   alert('New season started successfully!')
    //   window.location.reload()
    // } else {
    //   alert('Failed to start a new season.')
    // }
  }

  const generateFixtures = async () => {
    'use server'

    const generateResponse = adminApiFetch('/season/generate-fixtures', {
      method: 'POST'
    })
    // if (generateResponse.ok) {
    //   alert('Fixtures generated successfully!')
    //   window.location.reload()
    // } else {
    //   alert('Failed to generate fixtures.')
    // }
  }

  return (
    <>
    <div>
      <button onClick={() => triggerNewSeason()}
              className={'bg-tertiary-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'}>Start
        New Season
      </button>
      <p className={'my-4'}>Start a new season by making a copy of all of the current seasons teams and players, then
        creating a new year entry and altering the option table to point to the new year.</p>
    </div>
  <div>
    <button onClick={() => generateFixtures()}
            className={'bg-tertiary-500 border-b-stone-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-stone-600'}>Generate
      Fixtures
    </button>
    <p className={'my-4'}>Generate fixtureStats on a fresh season, using all the available teams.</p>
  </div>
    </>
)
}
