const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});
 
mongoose.connect('mongodb+srv://apreczewski:test1234@cluster0-mi0ir.gcp.mongodb.net/omnistack?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.use(( request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(3333);