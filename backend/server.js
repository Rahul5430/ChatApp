const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.render('API is running');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}...`.yellow.bold);
});
