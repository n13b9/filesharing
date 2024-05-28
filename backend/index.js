const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const sokcetIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");

const authRoutes = require("./routes/authRoutes");
const fileShareRoutes = require("./routes/fileShareRoutes");

require("./db");
require("./models/userModel");
require("./models/verificationModel");

const PORT = process.env.PORT_ID;

const app = express();
const server = createServer(app);

// const io = new Server(server, {
//     cors:{
//         origin:process.env.FRONTEND_URL
//     }
//  });

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json());
app.use(
  cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
  })
);
app.use("/public", express.static("public"));

app.use("/auth", authRoutes);
app.use("/file", fileShareRoutes);

app.use("/", (req, res) => {
  res.send("API is working ....");
});

// io.on("connection", (socket) => {
//     console.log('new connection',socket.id);

//     socket.on('joinself',(data)=>{
//         console.log("joined self",data)
//     })
//     socket.on('uploaded',(data)=>{
//         console.log('uploaded',data)
//     })

//     socket.on('uploaded', (data) => {
//                 let sender = data.from;
//                 let receiver = data.to;

//                 console.log('uploaded', data);

//                 socket.to(receiver).emit('notify', {
//                     from: sender,
//                     message: 'New file shared'
//                 })
//     })

//   });

server.listen(PORT, () => {
  console.log("server is running at" + PORT);
});
