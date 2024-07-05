import React from 'react'
import { io } from "socket.io-client";

const SocketContext = React.createContext(null)

export function useSocket() {
    const peer = React.useContext(SocketContext);
    return peer;
}

function SocketProvider({children}) {


    // var socket = React.useMemo(() => io('http://192.168.70.204:9000'), [])
    var socket = React.useMemo(() => io('https://video-socket-smyy.onrender.com'), [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider