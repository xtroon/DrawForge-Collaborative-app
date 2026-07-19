require("dotenv").config();
const app = require("./src/app")

const connectToDB = require("./src/config/db")

connectToDB()

const http = require('http');
const { Server } = require('socket.io');
const { initSocket } = require('./src/socket/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

initSocket(io);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}...`);
});