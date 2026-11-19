const express = require("express")

const cors = require('cors');

const app = express()

//when deploying on Render/Railway/Heroku behind a reverse proxy, this allows rate-limit to read the client's real IP address
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use("/api/", apiLimiter); //aplied rate limit to all /api routes

const boardRoutes = require('./routes/board.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');

app.use('/api/boards', boardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;