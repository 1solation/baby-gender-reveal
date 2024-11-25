const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let revealTime = null;
let gender = null;

// Admin Page
app.get("/admin", (req, res) => {
  res.render("admin", { revealTime, gender });
});

app.post("/admin", (req, res) => {
  revealTime = new Date(req.body.revealTime).getTime();
  gender = req.body.gender;
  io.emit("update", { revealTime, gender });
  res.redirect("/admin");
});

// Reveal Page
app.get("/", (req, res) => {
  res.render("reveal", { revealTime, gender });
});

// Socket.io for live updates
io.on("connection", (socket) => {
  socket.emit("update", { revealTime, gender });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
