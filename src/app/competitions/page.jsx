import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import SubHeading from '@/components/SubHeading'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Annual League Competition'),
  description: 'Information about the competitions held by the league annually, including the Fred Holden Cup, Annual Closed Competition, and other events.'
}

export default async function Page () {
  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto'>
        <MainHeading name='Annual League Competition' />
        <p className='my-6'>Each division is usually based on  ten teams; each team will play each other twice (home and away).</p>
        <p className='my-6'>The format of the League is usually decided at the formation meeting in July/August.
          At the end of the season the top two teams in each division will be promoted.
        </p>
        <p className='my-6'>The bottom two in each division will be relegated. If a division has only nine teams then only one would be relegated but two promoted.</p>
        <p className='my-6 border border-stone-300 p-4 rounded'>The Committee reserve the right to vary this according to the number of teams who apply to play in the League
          and the constitution of the teams involved.
        </p>

        <SubHeading name='The Fred Holden (Handicap) Cup' />
        <p className='my-6'>The Fred Holden Trophy is contested by all the teams in the league, the competition is team handicapped.</p>
        <p className='my-6'>It is a straightforward Knock out. A preliminary round will start the competition with the first round involving 32 teams.
          It will then continue down to a final held at the end of the league programme.
        </p>

        <SubHeading name='Annual Closed Competition - The Big Day' />
        <p className='my-6'>This full day event normally takes place on a Sunday in February and is open to all current League Members.</p>
        <p className='my-6'>The competitions usually include an open Singles and a Plate together, so far as possible, with either, Doubles,
          Handicapped Singles and/or, Handicapped Doubles.
          The Tournaments Secretary will decide on the exact format dependent on the number of entries and time available. Further details will be provided closer to the day.
        </p>
        <p className='my-6'>Players will be required to pre-register for the day in advance. Individuals who turn up on the day without pre-registering will not be allowed to play.
          There will be a small entry fee.
        </p>

        <SubHeading name='Other Competitions' />

        <p className='my-6'>
          The format of these competitions will be determined by the Tournament Secretary, dependent on the number of entries received.
          Usually they will start as round robin before moving to a knockout stage.
        </p>
        <p className='my-6'>
          The exact dates of these competitions are given in the Handbook section of the Website at the start of each season.
        </p>

        <h3 className='text-lg font-semibold mb-3 mt-5'>The Vets Competitions</h3>
        <p className='my-6'>
          The Vets Competitions are usually played on one or more evenings in December and are open to all current league
          players &amp; Bat &amp; Chat regulars at HTTC and St Peters Burnley. Of late we have used the following categories:
        </p>
        <ul className='list-disc pl-6'>
          <li>Younger Vets - 40 years and over</li>
          <li>Older Vets - 60 years and over</li>
        </ul>

        <h3 className='text-lg font-semibold mb-3 mt-5'>The Divisional Handicap Competitions</h3>
        <p className='my-6'>
          We have recently reintroduced the Divisional Handicap Competitions to be played sometime in February. There is a Premier &amp; First Division
          Competition one evening and a Second and Third Division Competition another. Player handicaps will be taken from the latest individual ranking
          points and matches will be best of three games first to 21 points.
        </p>

        <h3 className='text-lg font-semibold mb-3 mt-5'>Hard Bat (Ping Pong) Competition and Summer League</h3>
        <p className='my-6'>
          Dependent upon the interest shown by current players these will be arranged if possible to take place after the end of the Annual League fixture programme.
        </p>
      </div>
    </FrontLayout>
  )
}
