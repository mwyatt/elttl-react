import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import SubHeading from '@/components/SubHeading'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Competitions'),
  description: '@todo'
}

export default async function Page () {
  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Competitions' />
        {/* @todo need to update dates on here */}
        <p className='my-6'>Each division is usually based on  ten teams; each team will play each other twice (home and away).</p>
        <p className='my-6'>The format of the League is usually decided at the formation meeting in July/August.
          At the end of the season the top two teams in each division will be promoted.
        </p>
        <p className='my-6'>The bottom two in each division will be relegated. If a division has only nine teams then only one would be relegated but two promoted.</p>
        <p className='my-6 border border-stone-300 p-4 rounded'>The Committee reserve the right to vary this according to the number of teams who apply to play in the League.</p>

        <SubHeading name='The Fred Holden (Handicap) Cup' />
        <p className='my-6'>The Fred Holden Trophy is contested by all the teams in the league, the competition is team handicapped.</p>
        <p className='my-6'>It is a straightforward Knock out. A preliminary round will start the competition with the first round involving 32 teams.
          It will then continue down to a final held in the <strong>week beginning 3rd April</strong>.
        </p>

        <SubHeading name='Annual Closed Competitions - The Big Day' />
        <p className='my-6'>These will be contested on <strong>Sunday 12th February 2023</strong>.</p>
        <p className='my-6'>The competitions usually include Singles, Doubles, Handicapped Singles, Handicapped Doubles (a plate competition might also be included).
          The Tournaments Secretary will decide on the exact format. Further details will be provided closer to the day.
        </p>
        <p className='my-6'>Players will be required to pre-register for the day in advance. Individuals who turn up on the day without pre-registering will not be allowed to play.</p>

        <SubHeading name='Other Competitions' />
        <p className='my-6'>The format of these competitions will be determined by the Tournament Secretary, dependent on the number of entries received.</p>
        <p className='my-6'>The Vets, Super Vets and Super Super Vets Competitions will be played in week beginning <strong>19th December 2022</strong>.</p>

        <p className='my-6'>The Vets Competitions will be played over one night if practical. Further details will be provided nearer the date.
          The Super Super Vets Competition is for our increasing number of players over the age of 70.
        </p>
        <p className='my-6'>A reminder that the Vets is for players over 50 and the Super vets for those over 60 on the day of the competition.</p>

        <SubHeading name='Hard Bat (Ping Pong) Competition and the Summer League' />
        <p className='my-6'>A decision will be made by the Committee as to them taking place this season and this information will be communicated following discussions with players about the interest shown.</p>
      </div>
    </FrontLayout>
  )
}
