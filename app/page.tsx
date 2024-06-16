'use client'

import { usePeerConnection } from "@/context/PeerConnection";
import ReactPlayer from 'react-player'
export default function Home() {

  const peer = usePeerConnection()

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-24 p-12">
      <div className="flex justify-center items-center gap-24">
        {
          peer?.localStreams && <ReactPlayer className="bg-red-400" playing muted url={peer?.localStreams} />
        }
        {
          peer?.remoteStreams && <ReactPlayer className="bg-red-400" playing muted url={peer?.remoteStreams} />
        }
      </div>
      <button className="px-12 hover:cursor-pointer bg-red-400 py-4 text-white rounded-md shadow-md" onClick={() => peer?.makeCall()} >Start Call</button>
    </div>
  );
}
