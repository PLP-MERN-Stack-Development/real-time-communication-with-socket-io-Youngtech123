const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Simple in-memory "user database" for demo purposes
const users = {}; // { username: password }

// API routes
app.get("/", (req, res) => res.send("API is up and running..."));

// Register user (simple)
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Username and password required" });
  if (users[username]) return res.status(400).json({ msg: "Username already exists" });
  users[username] = password;
  res.json({ msg: "Registered successfully" });
});

// Login user (simple)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ msg: "Login successful" });
  } else {
    res.status(400).json({ msg: "Invalid username or password" });
  }
});

// HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
    socket.to(room).emit("userJoined", username);
  });

  // Chat messages
  socket.on("chatMessage", (data) => {
    if (socket.room) io.to(socket.room).emit("chatMessage", data);
  });

  // Typing indicator
  socket.on("typing", () => {
    if (socket.room) socket.to(socket.room).emit("typing", socket.username);
  });

  socket.on("stopTyping", () => {
    if (socket.room) socket.to(socket.room).emit("stopTyping", socket.username);
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.username && socket.room) {
      console.log(`${socket.username} left room: ${socket.room}`);
      socket.to(socket.room).emit("userLeft", socket.username);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
