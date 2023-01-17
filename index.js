const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

io.on('connection', (socket) => {
	console.log('A user is connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

const dbUrl =
	'mongodb+srv://rahul5430:Dlxt2JHsBFvPwth1@cluster0.nguebqc.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUrl, (err) => {
	console.log('MongoDB Connected', err);
});

const messageSchema = {
	name: String,
	message: String,
};

const Message = mongoose.model('Messages', messageSchema);

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.post('/messages', (req, res) => {
	const message = new Message(req.body);
	message.save((err) => {
		if (err) {
			res.sendStatus(500);
		}
		io.emit('message', req.body);
		res.sendStatus(200);
	});
});

app.get('/', (req, res) => {
	res.sendFile(index.html);
});
const server = http.listen(5000, () => {
	console.log('Server is running at port', server.address().port);
});
