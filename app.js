const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const socketIO = require('socket.io');


const app = express();

// Setup socketIO
const io = socketIO();
app.io = io;

// Routes
const usersRouter = require('./routes/users')(io);

// Setup mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Connection Instance
const Db = mongoose.connection;
Db.on('error', console.error.bind(console, 'MongoDB connection error'));
Db.on('connected', console.log.bind(console, 'MongoDB connected'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
