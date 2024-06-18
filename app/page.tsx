'use client'
import React from "react";
import { usePeerConnection } from "@/context/PeerConnection";
import { useRouter } from "next/navigation";

export default function Home() {

  const peer = usePeerConnection();
  const route = useRouter()
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')

  const handleClick = () => {
    if (id.length < 2 || name.length < 2) {
      alert('Room Id and Name length Should be greater than 2')
      return
    }
    peer?.setRoomId(id)
    peer?.setName((e) => ({ ...e, local: name }))
    peer?.makeCall(id)
    route.push('/video')
  }

  return (
    <div className="h-screen w-screen justify-center items-center flex flex-col">

      <div className="bg-gray-100 p-12 shadow-md rounded-md justify-center items-center flex flex-col gap-6">
        <div>
          <h1 className="font-['Montserrat'] mb-2 w-full text-left text-gray-600">Enter Your Name</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white shadow-md rounded-md px-4 py-2 w-full"
          />
        </div>
        <div>
          <h1 className="font-[Montserrat] mb-2 w-full text-left text-gray-600">Enter The Room ID</h1>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="bg-white shadow-md rounded-md px-4 py-2 w-full"
          />
        </div>
        <button
          onClick={handleClick}
          className="bg-blue-400 font-[Montserrat] text-white shadow-md mt-4 rounded-md w-full py-2 text-lg hover:cursor-pointer block">
          Join The Room
        </button>
      </div>
    </div>
  );
}
