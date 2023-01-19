const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('./models/message');
const router = require('./router');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const alert = require('alert');

// const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils');

const PORT = process.env.PORT || 3001;
const sessions = new Map();
const globalRoomId = uuidv4();
let users = [];
let rooms = [
	{
		id: globalRoomId,
		name: 'Global',
		userId: 0,
		username: 'None',
		avatar: 'https://semantic-ui.com/images/avatar2/small/patrick.png',
		members: [],
	},
];
let privateRooms = [];

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	cors: {
		origin: '*',
	},
});

app.use(express.static(__dirname));
app.use(cors({ origin: '*' }));
app.use(router);

io.use((socket, next) => {
	console.log('io.use() running');

	const sessionId = socket.handshake.auth.sessionId;

	if (sessionId) {
		const session = sessions.get(sessionId);

		if (session) {
			console.log('Use existing user from session', sessionId);
			socket.sessionId = sessionId;
			socket.userId = session.userId;
			socket.username = session.username;
			socket.avatar = session.avatar;
			socket.roomId = session.roomId;

			return next();
		}
	}

	console.log('Create new user');
	socket.sessionId = uuidv4();
	socket.userId = uuidv4();
	socket.username = socket.handshake.auth.username;
	socket.roomId = globalRoomId;

	next();
});

io.on('connection', (socket) => {
	console.log('A user is connected');

	// return session data to client once client is connected
	socket.emit('session', {
		sessionId: socket.sessionId,
		userId: socket.userId,
	});

	// receive username and avatar from client once client is connected
	socket.on('user', ({ username, avatar }) => {
		socket.username = username;
		socket.avatar = avatar;
	});

	// this function is run everytime client connects or reconnects
	// setup the client by adding to users array, joining room and send back user info to client
	socket.on('setUpUser', () => {
		const user = {
			userId: socket.userId,
			username: socket.username,
			avatar: socket.avatar,
			roomId: socket.roomId,
		};

		users.push(user);
		socket.join(socket.roomId);

		sessions.set(socket.sessionId, user);

		socket.emit('user', user);

		rooms.map((room) => {
			if (room.id === socket.roomId) {
				room.members.push(socket.username);
			}
			return room;
		});

		const message = {
			type: 'info',
			room: socket.roomId,
			content: socket.username + ' has joined room',
		};

		socket.broadcast.to(globalRoomId).emit('chat', message);

		io.sockets.emit('users', users);
		io.sockets.emit('rooms', rooms);
	});

	socket.on('createRoom', (roomName) => {
		console.log('creating room', roomName);
		const room = {
			id: uuidv4(),
			name: roomName,
			username: socket.username,
			userId: socket.userId,
			avatar: socket.avatar,
			members: [],
		};
		rooms.push(room);
		socket.join(room.id);
		io.sockets.emit('rooms', rooms);
	});

	socket.on('createPrivateRoom', (receiver, sender) => {
		console.log(
			`creating private room, receiver: ${receiver}, sender: ${sender}`
		);
		const privateRoom = {
			id: uuidv4(),
			members: [sender, receiver],
		};
		privateRooms.push(privateRoom);
		socket.join(privateRoom.id);
		io.sockets.emit('privateRooms', privateRooms);
	});

	socket.on('updateRoom', (roomId) => {
		console.log('updating room');

		// if same room then ignore
		if (socket.roomId === roomId) return;

		// if private room
		let room = rooms.find((room) => room.id === roomId);
		let privateRoom = room.private;
		console.log('private room', privateRoom);

		// if no member of private room then ignore
		if (privateRoom && room.members.length === 2) {
			alert(
				'You cannot join a private room which you are not a member of.'
			);
			return;
		}

		let msg = {};

		// broadcast "left room" to all other users of previous room of user
		msg = {
			type: 'info',
			room: socket.roomId,
			content: socket.username + ' has left room',
		};

		socket.broadcast.to(socket.roomId).emit('chat', msg);

		// remove username of disconnected user from all rooms member list
		rooms.map((room) => {
			if (room.members.includes(socket.username)) {
				let index = room.members.indexOf(socket.username);
				if (index !== -1) room.members.splice(index, 1);
			}
			return room;
		});

		// remove rooms created by diconnected user from rooms list if all members left room
		rooms = rooms.filter((room) => {
			let u = users.find((user) => user.userId === room.userId);
			if (room.members.length > 0 || u || room.id === globalRoomId) {
				return room;
			}
		});

		// send new room to client to update local state
		socket.emit('room', roomId);

		if (socket.rooms.has(roomId)) {
			// Already member of room. just changing active room
			socket.roomId = roomId;

			msg = {
				type: 'info',
				room: socket.roomId,
				content: socket.username + ' has entered room',
			};

			socket.broadcast.to(socket.roomId).emit('chat', msg);

			// store username in new room members list
			rooms.map((room) => {
				if (room.id === socket.roomId) {
					room.members.push(socket.username);
				}
				return room;
			});

			io.sockets.emit('rooms', rooms);

			let user = {
				userId: socket.userId,
				username: socket.username,
				avatar: socket.avatar,
				roomId: socket.roomId,
			};

			sessions.set(socket.sessionId, user);

			return;
		}

		if (rooms.some((room) => room.id === roomId)) {
			socket.roomId = roomId;
			socket.join(roomId);
		} else {
			socket.roomId = globalRoomId;
			socket.join(globalRoomId);
		}

		// check if there is no duplicate entry of users in same room
		rooms.map((room) => {
			if (room.id === socket.roomId) {
				room.members.push(socket.username);
			}
			return room;
		});

		msg = {
			type: 'info',
			room: socket.roomId,
			content: socket.username + ' has joined room',
		};

		socket.broadcast.to(socket.roomId).emit('chat', msg);

		io.sockets.emit('rooms', rooms);

		user = {
			userId: socket.userId,
			username: socket.username,
			avatar: socket.avatar,
			roomId: socket.roomId,
		};

		sessions.set(socket.sessionId, user);
	});

	socket.on('deleteRoom', (roomId) => {
		console.log('roomid', roomId);
		rooms = rooms.filter((room) => room.id !== roomId);
		io.sockets.emit('rooms', rooms);
	});

	socket.on('message', (message) => {
		const msg = {
			type: 'message',
			room: socket.roomId,
			userId: socket.userId,
			username: socket.username,
			avatar: socket.avatar,
			content: message,
			date: new Date(),
		};

		io.sockets.to(socket.roomId).emit('chat', msg);
	});

	socket.on('typing', () => {
		io.sockets.to(socket.roomId).emit('typing', socket.username);
	});

	socket.on('stoppedTyping', () => {
		io.sockets.to(socket.roomId).emit('stoppedTyping');
	});

	socket.on('disconnect', () => {
		console.log('disconnect: user disconnected');

		// remove disconnected user from users list
		users = users.filter((user) => user.userId !== socket.userId);

		// remove username of disconnected user from all rooms member list
		rooms.map((room) => {
			if (room.members.includes(socket.username)) {
				let index = room.members.indexOf(socket.username);
				if (index !== -1) room.members.splice(index, 1);
			}
			return room;
		});

		const message = {
			type: 'info',
			content: socket.username + ' went offline',
		};

		socket.broadcast.to(socket.roomId).emit('chat', message);

		io.sockets.emit('users', users);
		io.sockets.emit('rooms', rooms);
	});
});

mongoose.connect(process.env.DB, (err) => {
	console.log('MongoDB Connected', err);
});

// const messageSchema = {
// 	name: String,
// 	message: String,
// };

// const Message = mongoose.model('Messages', messageSchema);

// app.get('/messages', (req, res) => {
// 	Message.find({}, (err, messages) => {
// 		res.send(messages);
// 	});
// });

// app.post('/messages', (req, res) => {
// 	const message = new Message(req.body);
// 	message.save((err) => {
// 		if (err) {
// 			res.sendStatus(500);
// 		}
// 		io.emit('message', req.body);
// 		res.sendStatus(200);
// 	});
// });

const server = http.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
