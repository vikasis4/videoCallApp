class Peer {
    peer: any
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });
        }
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    async getAnswer(offer: any) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans
    }

    async setAnswer(answer: any) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
}

export default new Peer()