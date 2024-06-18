'use client'
import React from 'react'
import peer from '@/service/peer';
import soc from '@/service/socket';

interface contextType {
    makeCall: (id: string) => void,
    localStreams: any,
    remoteStreams: any,
    peer:any,
    roomId: string,
    name: { local: string, remote: string },
    setRoomId: React.Dispatch<React.SetStateAction<string>>
    setName: React.Dispatch<React.SetStateAction<{ local: string, remote: string }>>
}
const PeerConnectionContext = React.createContext<contextType | null>(null)

export function usePeerConnection() {
    const peer = React.useContext(PeerConnectionContext);
    return peer;
}

function PeerConnectionProvider({ children }: { children: React.ReactNode }) {

    const [localStreams, setLocalStream] = React.useState<any>(null)
    const [remoteStreams, setRemoteStream] = React.useState<any>(null)
    const [roomId, setRoomId] = React.useState<string>('84yf4')
    const [name, setName] = React.useState<{ local: string, remote: string }>({ local: 'Vikas', remote: 'Not Joined Yet' })

    // ADDING EVENT LISTENERS
    React.useEffect(() => {
        soc.socket.on('offer', handleOffer)
        soc.socket.on('answer', handleAnswer)
        soc.socket.on('ice-candidates', saveIceCandidates)
        peer.peer.addEventListener('icecandidate', sendIceCandidates);
        peer.peer.addEventListener('track', getRemoteStream);

        return () => {
            soc.socket.off('offer', handleOffer)
            soc.socket.off('answer', handleAnswer)
            soc.socket.off('ice-candidates', saveIceCandidates)
            peer.peer.removeEventListener('track', getRemoteStream);
            peer.peer.removeEventListener('icecandidate', sendIceCandidates);
        }
    }, [])

    // ADDING THE TRACKS & SENDING THE OFFER
    async function makeCall(id: string) {
        const constraints = { 'video': true, 'audio': true };
        const localStream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(localStream)

        localStream.getTracks().forEach(track => {
            peer.peer.addTrack(track, localStream);
        });

        const offer = await peer.getOffer();
        soc.socket.emit('offer', offer);
    }

    // HANDLING OFFER
    const handleOffer = async (data: any) => {
        var answer = await peer.getAnswer(data)
        soc.socket.emit('answer', answer);
    }
    const handleAnswer = async (data: any) => {
        await peer.setAnswer(data);
    }

    // HANDLING ICE CANDIDATES 
    const sendIceCandidates = (event: any) => {
        if (event.candidate) {
            soc.socket.emit('ice-candidates', event.candidate);
        }
    }
    const saveIceCandidates = async (iceCandidate: any) => {
        try {
            await peer.peer.addIceCandidate(iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }

    // HANDLING REMOTE STREAM
    const getRemoteStream = async (event: any) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream)
    }

    return (
        <PeerConnectionContext.Provider value={{ makeCall, localStreams, remoteStreams, roomId, setRoomId, name, setName, peer }}>
            {children}
        </PeerConnectionContext.Provider>
    )
}

export default PeerConnectionProvider