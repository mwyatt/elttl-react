import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import { fetchJson } from '@/app/lib/fetchWrapper'
import HandicapCalculator from '@/components/HandicapCalculator'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Handicap Calculator'),
  description: 'Using two players rankings, this calculates the handicap for each player, shows its working out and outputs the start the disadvantaged player receives.'
}

export default async function Page () {
  const {
    players
  } = await fetchJson('/handicap-calculator')

  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='Handicap Calculator' />
        <p className='my-4'>Select two players to find out handicaps and what the disadvantaged player gets to start a game with:</p>
        <HandicapCalculator players={players} />
      </div>
    </FrontLayout>
  )
}
