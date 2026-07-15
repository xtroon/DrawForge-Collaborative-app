const express = require("express")

const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json());

const boardRoutes = require('./routes/board.route');

app.use('/api/boards', boardRoutes);

module.exports = app;