import { io } from "socket.io-client";

class Socket{
    socket:any;
    constructor(){
        if (!this.socket) {
            this.socket = io('http://localhost:9000')
        }
    }
}

export default new Socket()