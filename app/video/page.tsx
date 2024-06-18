'use client'
import React from 'react'
import ReactPlayer from 'react-player'
import { usePeerConnection } from "@/context/PeerConnection";
import { useRouter } from 'next/navigation';


function page() {

  const peer = usePeerConnection();
  const router = useRouter()

  const exit = () => {
    peer?.peer.peer.close();
    router.push('/');
  }

  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center'>
      <h1 className='font-[Montserrat] text-4xl w-full text-center p-12'>Room Id :- {peer?.roomId}</h1>
      <div className='flex gap-8 px-8 h-full w-full justify-around items-center'>
        <Wrapper foo={peer?.localStreams ? true : false} link={peer?.localStreams} name={peer?.name.local} />
        <Wrapper foo={peer?.remoteStreams ? true : false} link={peer?.remoteStreams} name={peer?.name.remote} />
      </div>

      <div className='flex gap-8 p-8'>
        <button className='shadow-md rounded-md p-4 bg-red-500 hover:cursor-pointer text-white'>Mute/UnMute</button>
        <button className='shadow-md rounded-md p-4 bg-red-500 hover:cursor-pointer text-white'>Show/Hide Video</button>
        <button onClick={exit} className='shadow-md rounded-md p-4 bg-red-500 hover:cursor-pointer text-white'>Exit Room</button>
      </div>

    </div>
  )
}

function Wrapper({ link, foo, name }: any) {
  return (
    <div className='flex flex-col h-full w-full'>
      <h1 className='font-[Montserrat] text-2xl w-full text-center p-4'>{name}</h1>
      {
        foo ?
          <ReactPlayer playing muted url={link} className='' />
          :
          <div className='h-2/3 w-full bg-gray-300 rounded-md shadow-md' />
      }
    </div>
  )
}

export default page