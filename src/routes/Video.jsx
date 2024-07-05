import React from 'react'
import { useSocket } from '../context/socket'
import { Link, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import peer from '../peer'

function Video() {

    const socket = useSocket();
    const { roomId } = useParams();
    const [myStream, setMyStream] = React.useState(null)
    const [remoteStreams, setRemoteStreams] = React.useState(null)

    /////////////////////////////   SDP   ////////////////////////////////////////////////////////// 
    const handleUserJoined = React.useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('offer', { offer, roomId })
    }, [peer.getOffer, socket])

    const handleIncomingOffer = React.useCallback(async (data) => {
        const answer = await peer.getAnswer(data.offer);
        socket.emit('answer', { answer, roomId })
    }, [peer.getAnswer, socket])

    const handleIncomingAnswer = React.useCallback(async (data) => {
        await peer.setLocalDescription(data.answer);
    }, [peer.setLocalDescription, socket])

    const handleNegoNeeded = React.useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('offer', { offer, roomId })
    }, [peer.getOffer, socket]);
    ///////////////////////////////   ICE   //////////////////////////////////////////////////////// 
    const saveIceCandidates = React.useCallback(async (iceCandidate) => {
        await peer.peer.addIceCandidate(iceCandidate.data);
    }, [peer.peer])

    const sendIceCandidates = React.useCallback((event) => {
        if (event.candidate) {
            socket.emit('ice-candidates', { data: event.candidate, roomId });
        }
    }, [socket])
    //////////////////////////////   STREAM   /////////////////////////////////////////////////////////// 

    const getRemoteStream = React.useCallback(async (event) => {
        console.log("remote streams");
        const [remoteStream] = event.streams;
        setRemoteStreams(remoteStream)
    }, [peer.peer])
    /////////////////////////////   HOOKS   //////////////////////////////////////////////////////////// 

    React.useEffect(() => {
        peer.peer.addEventListener('icecandidate', sendIceCandidates);
        peer.peer.addEventListener('track', getRemoteStream);
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener('icecandidate', sendIceCandidates);
            peer.peer.removeEventListener('track', getRemoteStream);
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        }
    }, [peer.peer, getRemoteStream, sendIceCandidates]);

    React.useEffect(() => {
        socket.on('room-joined', handleUserJoined)
        socket.on('offer', handleIncomingOffer)
        socket.on('answer', handleIncomingAnswer)
        socket.on('ice-candidates', saveIceCandidates)

        return () => {
            socket.off('room-joined', handleUserJoined)
            socket.off('offer', handleIncomingOffer)
            socket.off('answer', handleIncomingAnswer)
            socket.off('ice-candidates', saveIceCandidates)
        }

    }, [socket, handleUserJoined, handleIncomingOffer, handleIncomingAnswer])

    React.useEffect(() => {
        const runFxn = async () => {
            const constraints = { 'video': true, 'audio': true };
            const localStream = await navigator.mediaDevices.getUserMedia(constraints);
            setMyStream(localStream);
            localStream.getTracks().forEach(track => {
                peer.peer.addTrack(track, localStream);
            });
        }
        runFxn()
    }, [])


    console.log(window.screen.width, window.screen.height);
    return (
        <div className='flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8 h-full w-full sm:h-screen sm:w-screen pt-4'>
            <ReactPlayer width={window.screen.width < 400 ? window.screen.width-20 : window.screen.width / 2} playing muted url={myStream} className='border-2 border-black bg-black rounded-md shadow-md' />
            <ReactPlayer  width={window.screen.width < 400 ? window.screen.width-20 : window.screen.width / 2}  playing className='border-2 border-black bg-black rounded-md shadow-md' url={remoteStreams} />
            <Link className='fixed bottom-4 hover:cursor-pointer' to="/" >
                <img src={require('../pub/circle.png')} height={70} width={70} />
            </Link>
        </div>
    )
}

export default Video