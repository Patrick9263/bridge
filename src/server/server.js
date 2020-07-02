'use-strict';

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const CreateSocket = require('socket.io');

const io = CreateSocket(server);

const users = {};

io.on('connection', socket => {
	if (!users[socket.id]) {
		console.log(`user ${socket.id} connected`);
		users[socket.id] = socket.id;
	}
	socket.emit('yourID', socket.id);

	io.sockets.emit('allUsers', users);
	socket.on('disconnect', () => {
		delete users[socket.id];
		io.sockets.emit('allUsers', users);
		console.log(`user ${socket.id} disconnected`);
	});

	socket.on('callUser', data => {
		io.to(data.userToCall).emit('callingUser', {
			signal: data.signalData, from: data.from,
		});
	});

	socket.on('acceptCall', data => {
		io.to(data.to).emit('callAccepted', data.signal);
	});

	socket.on('ignoreCall', data => {
		io.to(data.to).emit('callIgnored');
	});
});

const port = 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));
