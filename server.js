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
    
    //recieve the message 'knobState' from the leader, the content of which is called with the function knobMsg
    socket.on('knobState', knobMsg);

    //knobMsg function is called, which holds the data from the 'mouse' message 
    function knobMsg(data) {
        //when the 'knobState' message comes in, send the data out to the client as 'remoteKnob'
        socket.broadcast.emit('remoteKnob',data);
        //if you wanted the data to go back out to everyone including yourself you would write
        //io.sockets.emit('remoteKnob',data);

        //in the server console (terminal), print the data that was sent from the leader
        console.log("Knob State: ", data);
    }

    socket.on('slideState', slideMsg);
    
    function slideMsg(data) {
      socket.broadcast.emit('LEDstate', data);

      console.log("LED State: ", data);
    }
}
