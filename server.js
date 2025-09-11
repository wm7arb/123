const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// الاتصال بقاعدة البيانات MongoDB (استخدم الرابط الذي قدمته سابقًا)
mongoose.connect('mongodb+srv://Nnsnsjj:whney@cluster0.iodkr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// إعداد نموذج الرسالة
const messageSchema = new mongoose.Schema({
  text: String,
  user: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// خادم الويب
app.use(express.static('public'));

// عند الاتصال بالخادم عبر Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // إرسال جميع الرسائل للمستخدمين المتصلين عند الاتصال
  Message.find().then(messages => {
    socket.emit('previous messages', messages);  // إرسال الرسائل السابقة للمستخدم الجديد
  });

  // عندما يرسل المستخدم رسالة
  socket.on('chat message', (msg) => {
    const message = new Message({ text: msg.text, user: msg.user });

    message.save().then(() => {
      io.emit('chat message', message); // إرسال الرسالة إلى جميع المتصفحين المتصلين
    });
  });

  // عندما ينقطع الاتصال
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// بدء الخادم على البورت 3000
server.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
