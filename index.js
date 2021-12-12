const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const path = require("path");
const { v4 } = require("uuid");
const env = require("dotenv");
env.config();

app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("login");
});


app.post("/ok", (req, res) => {
    let { name } = req.body;
    if (!name) return res.redirect("/");
    res.redirect(`/chat/${v4()}/${name}`);
});



app.get("/chat/:id/:user", (req, res) => {
    res.render("chat", { roomId: req.params.id, user: req.params.user });
});



io.on("connection", socket => {
    console.log("A user connected");



    socket.on("user_connected", roomId => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("An user joined room");
    });


    socket.on("message_send", (userName, roomId, message) => {

        io.to(roomId).emit("message_received", userName, message);
    });
});





server.listen(process.env.PORT, () => {
    console.log("server is running");
});