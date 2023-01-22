const express = require('express');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const path = require("path");
require('dotenv').config();

connectDB();
const app = express();

app.use(express.json());  // to accept json data

// --------------------------deployment------------------------------

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

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}...`.yellow.bold);
});
