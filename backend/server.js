const express = require('express');
const connectDB = require('./config/db');
const path = require("path");
require('dotenv').config();

connectDB();
const app = express();

app.use(express.json());

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname1, '/frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(
			path.resolve(__dirname1, 'frontend', 'build', 'index.html')
		)
	);
} else {
	app.get('/', (req, res) => {
		res.send('API is running..');
	});
}

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
	res.render('API is running');
});

const server = app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}...`.yellow.bold);
});
