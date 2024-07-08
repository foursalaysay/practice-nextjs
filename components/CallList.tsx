// @ts-nocheck

'use client'


import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import Loader  from './Loader';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';

const CallList = ({type} : {type : 'ended' | 'upcoming' | 'recordings'}) => {

  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();

  if (isLoading) return <Loader />
  
  const getCalls = () => {
    switch(type){
      case 'ended':
        return endedCalls
      case 'upcoming':
        return upcomingCalls
        // THE VIDEO IS WRONG AT THIS AREA
      case 'recordings':
        return callRecordings
      default:
        return [];
    }
  }

  const getNoCalls = () => {
    switch(type){
      case 'ended':
        return "No Previous Calls"
      case 'upcoming':
        return "No Upcoming Calls"
      case 'recordings':
        return 'No Recordings'
      default:
        return '';
    }
  }

  const calls = getCalls();
  const noCalls = getNoCalls();


  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? calls.map((meeting : Call | CallRecording) => (
        <MeetingCard 
        key={(meeting as Call).id}
        icon={
          type === 'ended' ? '/icons/previous.svg'
          : type === 'upcoming' ? '/icons/upcoming.svg'
          : '/icons/recordings.svg'
        }
        title={
          (meeting as Call).state.custom.description.substring(0,26) || 'No Description'
        }
        date={
          meeting.state.startsAt.toLocaleString() || meeting.start_time.toLocaleString()
        }
        isPreviousMeeting={type === 'ended'}
        buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
        buttonText={ type === 'recordings' ? 'Play' : 'Start'}
        handleClick={
          type === 'recordings' ? () => router.push(`${meeting.url}`) : router.push(`/meeting/${meeting.id}`) 

        }
        link={
          type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
        }
       
        
        />
      )) : (
        <h1>No Calls</h1>
      )}
    </div>
  )
}

export default CallList