const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('chat message', messages); // إرسال الرسائل السابقة للمستخدم الجديد

    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
