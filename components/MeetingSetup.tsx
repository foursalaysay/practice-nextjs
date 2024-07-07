import { tokenProvider } from '@/actions/stream.actions'
import { useUser } from '@clerk/nextjs'
import { DeviceSettings, StreamVideoClient, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from './ui/button'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete : (value : boolean) => void}) => {

    const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false)

    const call = useCall();

    useEffect(() => {
      if(isMicCamToggledOn){
        call?.camera.disable();
        call?.microphone.disable();

      }else{
        call?.camera.enable();
        call?.microphone.enable();
      }

      if(!call) throw new Error("useCall must be use within StreamCall Component")
    }, [isMicCamToggledOn,call, call?.camera, call?.microphone])
    
    
    


  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold'>Setup</h1>
        {/* THIS IS THE VIDEO PREVIEW COMPONENT COMING FROM STREAM COMPONENT */}
        <VideoPreview />
        <div className='flex h-16 items-center justify-center gap-3'>
            <label className='flex items-center justify-center gap-2 font-medium'>
                <input
                type='checkbox'
                checked={isMicCamToggledOn}
                onChange={(e) => setisMicCamToggledOn(e.target.checked)}
                />
                Join With Camera and Mic off
            </label>
            <DeviceSettings />
        </div>
        <Button className='rounded-md bg-green-500 px-4 py-2.5' 
        onClick={() => {
            call?.join()
            setIsSetupComplete(true)
            }}>
            Join Meeting
        </Button>
    </div>
  )
}

export default MeetingSetup