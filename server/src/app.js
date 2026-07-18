const express = require("express")

const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json());

const boardRoutes = require('./routes/board.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');

app.use('/api/boards', boardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;