'use-strict';

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const CreateSocket = require('socket.io');

const io = CreateSocket(server);

console.log('\n\n'
+ '---------------------------\n'
+ '    Socket.io connected    \n'
+ '---------------------------\n'
+ '\n\n');

const users = {};
io.on('connection', socket => {
	if (!users[socket.id]) {
		console.log(`user ${socket.id} connected`);
		users[socket.id] = socket.id;
	}
	socket.emit('yourID', socket.id);
	io.sockets.emit('allUsers', users);

	// User disconnects from server
	socket.on('disconnect', () => {
		delete users[socket.id];
		io.sockets.emit('allUsers', users);
		// console.log(`user ${socket.id} disconnected`);
	});

	// User starts calling
	socket.on('callUser', data => {
		io.to(data.userIdToCall).emit('callingUser', {
			signal: data.signalData, from: data.from,
		});
		console.log(`user ${socket.id} is calling`);
	});

	// User accepts call
	socket.on('acceptCall', data => {
		io.to(data.to).emit('callAccepted', data.signal);
		console.log(`user ${socket.id} accepted call`);
	});

	// User ignores call
	socket.on('ignoreCall', data => {
		io.to(data.to).emit('callIgnored', {
			signal: data.signal, from: data.from,
		});
		console.log(`user ${socket.id} ignored call`);
	});

	// User ends call
	socket.on('endCall', data => {
		io.to(data.to).emit('callEnded', data.signal);
		console.log(`user ${socket.id} ended call.`);
	});
});

const port = 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));
