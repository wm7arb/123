const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = []; // لتخزين الرسائل

app.use(express.static('public')); // خادم للملفات العامة مثل HTML و JS

// إرسال جميع الرسائل عند الاتصال
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('chat message', messages); // إرسال الرسائل السابقة للمستخدم الجديد

    // عندما يرسل المستخدم رسالة
    socket.on('chat message', (msg) => {
        messages.push(msg); // تخزين الرسالة في الذاكرة
        io.emit('chat message', msg); // إرسال الرسالة إلى جميع المتصفحين المتصلين
    });

    // عندما ينقطع الاتصال
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});
