import React from 'react'
import { useSocket } from '../context/socket'
import { Link } from 'react-router-dom'

function Home() {

    const [id, setId] = React.useState('')

    const socket = useSocket();

    const handleClick = () => { socket.emit('room', id) }


    return (
        <div className="h-screen w-screen justify-center items-center flex flex-col">

            <div className="bg-gray-100 p-12 shadow-md rounded-md justify-center items-center flex flex-col gap-6">
        
                <div>
                    <h1 className="font-[Montserrat] mb-2 w-full text-left text-gray-600">Enter The Room ID</h1>
                    <input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="bg-white shadow-md rounded-md px-4 py-2 w-full"
                    />
                </div>
                <Link
                    to={'/video/' + id}
                    onClick={handleClick}
                    className="bg-blue-400 text-center font-[Montserrat] text-white shadow-md mt-4 rounded-md w-full py-2 text-lg hover:cursor-pointer block">

                    Join The Room
                </Link>
                
            </div>
        </div>
    )
}

export default Home