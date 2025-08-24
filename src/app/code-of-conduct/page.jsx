import FrontLayout from '@/app/frontLayout'
import MainHeading from '@/components/MainHeading'
import { getMetaTitle } from '@/constants/MetaData'
import SubHeading from '@/components/SubHeading'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: getMetaTitle('Code of Conduct'),
  description: 'Disciplinary procedures and code of conduct for players in the league, including rules for behavior and consequences for violations.'
}

export default async function Page () {
  return (
    <FrontLayout>
      <div className='max-w-[768px] mx-auto text-sm'>
        <MainHeading name='Code of Conduct' />

        <SubHeading name='East Lancashire Table Tennis League (“ELTTL”) Disciplinary Procedure' />
        <SubHeading name='CODE OF CONDUCT' />

        <p className='my-4'>This applies to all persons participating in table tennis at a venue or event which is under the aegis or responsibility of ELTTL (whether or not they are current ELTTL Members).</p>
        <p className='my-4 font-semibold'>AT ALL TIMES</p>
        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>Members of ELTTL, officials, players and participators are expected to conduct themselves in an appropriate manner with due respect for other players, officials, spectators, parents and guardians and to refrain from any behaviour likely to bring the sport into disrepute.</p>
          </li>
        </ul>
        <p className='my-4 font-semibold'>WHILE UNDER THE JURISDICTION OF THE ELTTL</p>
        <p className='my-4'>The following types of offence would be considered a breach of the Code of Conduct, and may lead to sanctions. The list below is not intended to be comprehensive and any other conduct which may breach the above general principle may be dealt with under this Procedure.</p>
        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>Offensive racial, sexual or other discriminatory language or conduct</p>
          </li>
          <li>
            <p className='my-4'>Displays of bad temper, swearing or shouting</p>
          </li>
          <li>
            <p className='my-4'>Unsportsmanlike behaviour towards opponents</p>
          </li>
          <li>
            <p className='my-4'>Discourteous or abusive behaviour to match officials, other players, or members of the public within a match setting</p>
          </li>
          <li>
            <p className='my-4'>Abuse of equipment</p>
          </li>
          <li>
            <p className='my-4'>Non-compliance with instructions of event officials or organisers</p>
          </li>
          <li>
            <p className='my-4'>Deliberate or consistent breach of ELTTL Rules</p>
          </li>
          <li>
            <p className='my-4'>Deliberately falsifying a points score or match result or taking part in match fixing</p>
          </li>
          <li>
            <p className='my-4'>Deliberately avoiding payment of practice session fees</p>
          </li>
          <li>
            <p className='my-4'>Conduct endangering safety or the welfare of any minor</p>
          </li>
          <li>
            <p className='my-4'>Consumption of alcohol during a match</p>
          </li>
          <li>
            <p className='my-4'>Use of drugs or other illegal or performance-enhancing substances.</p>
          </li>
        </ul>

        <h2 className='font-semibold mb-4 mt-6'>DISCIPLINARY COMMITTEE</h2>

        <p className='my-4'>At the AGM of ELTTL, or otherwise at a meeting of the General Committee, a Disciplinary Panel will be appointed on an annual or ad-hoc basis consisting of no less than three General Committee Members (one of whom shall be appointed as Disciplinary Chairman) and one other non-executive ELTTL representative member.</p>
        <p className='my-4'>The Disciplinary Committee for each specific case will consist of all or a minimum of three Disciplinary Panel members appointed by the Disciplinary Chairman. No person involved in or with direct knowledge of the incident or matter which is the subject of the case shall be appointed.</p>

        <h2 className='font-semibold mb-4 mt-6'>DISCIPLINARY PROCESS</h2>

        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>The time limits and formal requirements set out below may be  subject to reasonable modification to accommodate the circumstances of the case and ensure that persons involved in the process are afforded a fair and reasonable opportunity to participate and be fairly treated.</p>
          </li>
          <li>
            <p className='my-4'>Any person may make an oral or written complaint of an alleged breach of the Code of Conduct to the any General Committee Member of the ELTTL who must refer it to the General Committee Chairman (“the Chairman”).</p>
          </li>
          <li>
            <p className='my-4'>If it is an oral complaint the Chairman may seek to resolve it informally or may deem it serious enough to be referred to the Disciplinary Committee. If it is a written complaint it must in any event be so referred. Such referral will be by a written report provided by the Chairman after an initial investigation, within 21 days of receipt of the complaint, to the Disciplinary Chairman. If at that stage the Chairman considers that the circumstances are of a sufficiently serious nature to warrant it, the Chairman may temporarily suspend the accused from participation in matches and/or other ELTTL activities.</p>
          </li>
          <li>
            <p className='my-4'>Upon delivery of the Chairman’s report to the Disciplinary Chairman the accused will, within 7 days of receipt, be provided with a copy and invited to provide a personal response in writing.</p>
          </li>
          <li>
            <p className='my-4'>Within a further 28 days the Disciplinary Chairman will appoint and convene a hearing of the Disciplinary Committee, at least 14 days written or e-notice of which will be given to the accused.</p>
          </li>
          <li>
            <p className='my-4'>At the hearing the Disciplinary Committee will consider the report and any response received and   will hear representations from the ELTTL General Committee and/or the Complainant and from the accused, all of whom may be represented. The standard of proof will be the balance of probability. Except in cases a) or b) below, a written decision will be issued by the Disciplinary Committee unless all parties agree to accept an oral decision given at the hearing. The written decision will be posted or e-sent to the accused within 14 days of the hearing and all decisions will be reported to the General Committee Chairman and recorded.</p>
          </li>
          <li>
            <p className='my-4'>The Disciplinary Committee may impose any one or more of the following sanctions:</p>
            <ol className='list- pl-6'>
              <li data-list-text='a)'>
                <p className='my-4'>a) A directive to the accused to make an oral or written apology to the complainant and/or the ELTTL General Committee (default of which will itself be deemed a further breach of conduct)</p>
              </li>
              <li data-list-text='b)'>
                <p className='my-4'>b) An oral warning</p>
              </li>
              <li data-list-text='c)'>
                <p className='my-4'>c) A written warning</p>
              </li>
              <li data-list-text='d)'>
                <p className='my-4'>d) Monetary compensation for damage to equipment or premises</p>
              </li>
              <li data-list-text='e)'>
                <p className='my-4'>e) A fine payable to ELTTL</p>
              </li>
              <li data-list-text='f)'>
                <p className='my-4'>f) Suspension from participation in practice sessions and/or league matches and/or cup matches and/or other events or competitions run by ELTTL either for a period of time or for a specified number and type of occasions.</p>
              </li>
              <li data-list-text='g)'>
                <p className='my-4'>g) Termination of ELTTL membership</p>
              </li>
              <li data-list-text='h)'>
                <p className='my-4'>h) Such other sanction as the Disciplinary Committee may in its discretion deem appropriate to the circumstances</p>
              </li>
            </ol>
          </li>
          <li>
            <p className='my-4'>Any person who receives two warnings including one written warning will automatically be excluded from ELTTL membership and participation unless and until readmitted by specific permission of the General Committee.</p>
          </li>
        </ul>

        <h2 className='font-semibold mb-4 mt-6'>APPEAL</h2>
        <ul className='list-disc pl-12'>
          <li>
            <p className='my-4'>An accused person may appeal against a disciplinary sanction other than a) or b) above by giving written notice stating the grounds of appeal to the Disciplinary Chairman and/or the General Committee Chairman within 28 days of accepting an oral decision or being sent a written decision.</p>
          </li>
          <li>
            <p className='my-4'>The appeal will be heard by the General Committee, or at least a quorum thereof, not including anyone involved in the Disciplinary Committee hearing. The appeal hearing will be arranged within 28 days of receipt of the notice of appeal.  Unless there are exceptional circumstances an appeal will normally only be justified if new evidence/circumstances are demonstrated to alter/ mitigate the decision of the Disciplinary Committee. Those hearing the appeal may confirm, set aside, reduce or increase any sanctions previously imposed.</p>
          </li>
          <li>
            <p className='my-4'>Further appeals can be made to either Lancashire County Table Tennis Association and/or Table Tennis England in accordance with their rules .</p>
          </li>
        </ul>
      </div>
    </FrontLayout>
  )
}
