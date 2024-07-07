'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { link } from 'fs'

const MeetingTypeList = () => {

    const router = useRouter();

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    

    const user = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime : new Date(),
        description: '',
        link: ''
    })

    const [callDetails, setcallDetails] = useState<Call>()

    const createMeeting = async () => {
        if(!client || !user) return;
        try{
            const id = crypto.randomUUID();
            const call = client.call('default', id);
            if(!call) throw new Error('Failed to create call')

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting';

            await call.getOrCreate({
                 data:{
                    starts_at : startsAt,
                    custom: {
                        description
                    }
                 }   
            })

            setcallDetails(call);

            if(!values.description){
                router.push(`/meeting/${call.id}`)
            }

        }catch(error){
            console.log(error)
        }
    }

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>

            {/* THESE ARE THE BOXES */}
            <HomeCard
                img='/icons/add-meeting.svg'
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className='bg-orange-1'
            />
            <HomeCard
                img='/icons/schedule.svg'
                title="Schedule Meeting"
                description="Plan your Meeting"
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className='bg-blue-1'
            />
            <HomeCard
                img='/icons/recordings.svg'
                title="View Recordings"
                description="Check our your recording"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className='bg-purple-1'
            />
            <HomeCard
                img='/icons/join-meeting.svg'
                title="Join Meeting"
                description="Via Invitation Link"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className='bg-yellow-1'
            />

            {/*  START A MEETING MODAL */}
            <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Start an instant Meeting"
            className='text-center'
            buttonText = "Start Meeting"
            handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList