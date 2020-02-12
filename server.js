

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/frontend/index.html`);
});

io.on('connection', socket => {
    socket.on('disconnect', () => {
        if(socket.name === undefined)
            return;

        console.log(`${socket.name} disconnected!`);
        io.emit('leave', socket.name);
    });

    socket.on('join', name => {
        if(name === null)
            return;

        console.log(`${name} joined!`);
        socket.name = name;
        io.emit('join', name);
    });

    socket.on('chat', data => {
        console.log(`chat data: ${JSON.stringify(data, null, 2)}`);
        io.emit('chat', data);
    });

    socket.on('start-type', (name, cb) => {
        console.log(`${name} started to type`);
        socket.broadcast.emit('start-type', name);
        cb();
    });

    socket.on('stop-type', (name, cb) => {
        console.log(`${name} stopped typing`);
        socket.broadcast.emit('stop-type', name);
        cb();
    });
});

server.listen(3000,() => console.log('Server running on port 3000'));