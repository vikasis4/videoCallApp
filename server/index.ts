const http = require("http");
const { Server } = require('socket.io')

const io = new Server({
    cors: {
        allowedHeaders: ["*"],
        origin: "*",
    },
});

const httpServer = http.createServer();
const PORT = 9000;
io.attach(httpServer);
httpServer.listen(PORT, () => console.log(`HTTP Server started at PORT:${PORT}`));

io.on('connection', (socket: typeof Server) => {
    socket.join('room');

    socket.on('offer', (data: any) => {
        console.log('offer');
        socket.broadcast.to('room').emit('offer', data)
    })

    socket.on('answer', (data: any) => {
        console.log('ans');
        socket.broadcast.to('room').emit('answer', data)
    })
    socket.on('ice-candidates', (data: any) => {
        console.log('ice');
        socket.broadcast.to('room').emit('ice-candidates', data)
    })
});
