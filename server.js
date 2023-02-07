const UserModel = require('./models/UserModel');
const GroupChat = require('./models/GroupChatModel');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// mongo db connection
const mongoDB = 'mongodb+srv://fall2022_comp3123:SAFA.aru1993@cluster0.lclqo7i.mongodb.net/comp3123_lab_test1?retryWrites=true&w=majority';
mongoose.connect(mongoDB, 
{
     useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
  console.log('MongoDB has connected successfully')
}).catch(err => {
  console.log('Error of MongoDB connection')
});

// socket io reference
const socketio = require('socket.io');
const formattedMessage = require('./models/formattedMassages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./models/users');
const ADMIN = 'Admin';



const http = require('http');

const path = require('path');
const server = http.createServer(app);
const io = socketio(server);
// Static folder

app.use(express.static(path.join(__dirname, 'public')));

// IO connection
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formattedMessage(ADMIN, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formattedMessage(ADMIN, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formattedMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formattedMessage(ADMIN, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 8000 || process.env.PORT;

// signup page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
app.post('/login',async (req, res) => {
    const newUser = new UserModel({
        username: username.req.body,
        password: password.req.body
    });
    try{
        const user = await newUser.save();
        res.redirect('/login');
    }
    catch(err){
        res.status(400).send(err);
    }
});
app.post('/signup', async (req, res) => {
    
    const user = new UserModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser)
    } 
    catch (er){
        res.status(400).json({message:er});
    }
});

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.find({username: username});
    if(user.length == 0){
        res.redirect('/signup');
    }
    else{
        if(user[0].password == password){
            res.redirect('/');
        }
        else{
            res.redirect('/login');
        }
    }
});

app.get('/chat/:room', async (req, res) => {
    const room = req.params.room;
    const messages = await GroupChatModel.find({room: room}).sort({createdAt: 1});
    if(messages.length == 0){
        res.render('chat', {room: room, messages: []});
    }
    else{
        res.render('chat', {room: room, messages: messages});
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


    



