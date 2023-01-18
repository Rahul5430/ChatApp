const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('./models/message');
const router = require('./router');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');

const PORT = process.env.PORT || 3001;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	cors: {
		origin: '*',
	},
});
// const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cors({ origin: '*' }));
app.use(router);

io.on('connection', (socket) => {
	console.log('A user is connected');

	socket.on('join', (data) => {
		const { name, room } = data;
		const { user, error } = addUser({ id: socket.id, name, room });

		if (error) {
			console.log(error);
			return;
		}

		console.log('joined');

		socket.emit('message', {
			user: 'admin',
			text: `${user.name}, welcome to the room!`,
		});

		socket.broadcast.to(user.room).emit('message', {
			user: 'admin',
			text: `${user.name} has joined the room.`,
		});

		socket.join(user.room);

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
	});

	socket.on('typing', async (data) => {
		const user = await getUser(socket.id);

		try {
			io.to(user.room).emit('typingResponse', { data });
		} catch (error) {
			console.log(error.message);
		}
	});

	socket.on('sendMessage', async (message) => {
		const user = await getUser(socket.id);

		try {
			io.to(user.room).emit('message', {
				user: user.name,
				text: message,
			});
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		} catch (err) {
			console.log(err.message);
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		console.log('user disconnected');

		if (user) {
			io.to(user.room).emit('message', {
				user: 'admin',
				text: `${user.name} has just left`,
			});
		}
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

// app.get('/', (req, res) => {
// 	// res.sendFile(index.html);
// 	res.send('Server is up and running!');
// });

const server = http.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
