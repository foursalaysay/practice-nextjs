
'use client'

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({ params }: { params: { id: string }}) => {


  // THIS FEATURE IS FROM CLERK, WE WILL DESTRUCTURE THE USER AND THE LOADER
  const { user, isLoaded } = useUser();

  // THIS USESTATE IS USE TO CHECK AND SET THE SETUP OF THE MEETING
  const [isSetupComplete, setIsSetupComplete ] = useState(false);


  //  IF ERROR OCCUS DESTRUCTURE THE PARAMS ABOVE WHEN CALLING FOR THE PARAMETER
  // I JUST TRIED THIS GETTING FROM PARAMS SO THAT I CAN BE GUIDED THAT IS COMING FROM THE PARAMETER
  const { call, isCallLoading } = useGetCallById(params.id);


  // CHECKING LOADED AREA IF IT IS STILL LOADING WE WILL CALL THE LOADER COMPONENT WHICH IS A LOADING PAGE
  if(!isLoaded || isCallLoading) return <Loader />



  return (
    <main className='h-screen w-full'>
        <StreamCall call={call}>
            <StreamTheme>
                {!isSetupComplete ? (
                    <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
                ) : (
                  <MeetingRoom />
                )}
            </StreamTheme>
        </StreamCall>
    </main>
  )
}

export default Meeting