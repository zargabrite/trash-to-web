//require express and socket.io
var express = require('express');
var socket = require('socket.io');

const PORT = process.env.PORT || 3000;

//???
var server = express()
    .use(express.static('public'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`)); 

//variable in charge of inputs and outputs, associate it with the server
const io = socket(server); 
//start dealing with new connections
io.sockets.on('connection', newConnection); 

//when there's a new connection, create a socket. socket.id allows each new connection to get a separate id number
function newConnection(socket) {
    console.log('new connection: ' + socket.id);
    
    //recieve the message 'mouse' from the client, the content of which is called with the function mouseMsg
    socket.on('mouse', mouseMsg);

    //mouseMsg function is called, which holds the data from the 'mouse' message 
    function mouseMsg(data) {
        //when the 'mouse' message comes in, send the data back out to the client (in this case with the same name and data)
        socket.broadcast.emit('mouse',data);
        //if you wanted the data to go back out to everyone including yourself you would write
        //io.sockets.emit('mouse',data);


        //in the server console (terminal), print the data that was sent from the client
        console.log(data);
    }
}
