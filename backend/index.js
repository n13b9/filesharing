const express = require('express');
const http = require('http');
const sokcetIO = require('socket.io');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { createServer } = require('node:http');

const authRoutes = require('./routes/authRoutes')
const fileShareRoutes = require('./routes/fileShareRoutes')

require('./db');
require('./models/userModel')
require('./models/verificationModel');


const PORT = 8000;

const app = express();
const server = createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials
}));

app.use(bodyParser.json());
app.use(cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
}));
app.use('/public', express.static('public'));


app.use('/auth',authRoutes);
app.use('/file',fileShareRoutes);

app.use('/',(req,res)=>{
    res.send('API is working ....')
})

server.listen(PORT,()=>{
    console.log('server is running at' + PORT )
})

