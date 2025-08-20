const express = require("express");
const db = require("./models");
const authRoutes = require("./routes/auth-routes");
const noteRoutes = require("./routes/note-routes");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// const Note = require("./models/notes")(
//   db.sequelize,
//   require("sequelize").DataTypes
// );

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
module.exports = io;
app.use(express.json());

// Test Database Connection
db.sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("DB connection error:", err));

// Note.sync();

// Sample Route
app.get("/", (req, res) => res.send("Welcome to Sequelize App!"));
app.use("/auth", authRoutes);
app.use(
  "/note",
  (req, res, next) => {
    req.io = io;
    next();
  },
  noteRoutes
);

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    socket.join(userId);
  }

  socket.on("disconnect", () => {});
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
