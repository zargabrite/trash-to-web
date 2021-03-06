//display setup variables
var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

//arduino serial port related variables
var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14101';    // fill in your serial port name here
var inArdData;   // variable to hold the input data from Arduino
var outArdData = {
  port10: 0,
  port11: 0
}; // for data output

function setup() {
    // display setup: set the canvas to match the window size
    if (window.innerWidth > minWidth){
      width = window.innerWidth;
    } else {
      width = minWidth;
    }
    if (window.innerHeight > minHeight) {
      height = window.innerHeight;
    } else {
      height = minHeight;
    }
  
    //display setup: set up canvas
    createCanvas(width, height);
    noStroke();
    background(0);

    //arduino: set up communication port with arduino
    serial = new p5.SerialPort();       // make a new instance of the serialport library
    serial.on('list', printList);  // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen);        // callback for the port opening
    serial.on('data', serialEvent);     // callback for when new data arrives
    serial.on('error', serialError);    // callback for errors
    serial.on('close', portClose);      // callback for the port closing

    serial.list();                      // list the serial ports
    serial.open(portName);              // open a serial port


    //connect to server
    socket = io.connect();

    socket.on('connect', function onConnect(){
      console.log('now connected to the server.');
    });

    //follow-to-lead 4. recieve the message called 'LEDVal' from the server and setup event handler (function 'LEDBrightness')
    socket.on('LEDstate', LEDBrightness);
    socket.on('knobPassed', outKnobPassed)
}

function LEDBrightness(data) {
    //follow-to-lead: 5. map the incoming LEDVal message's data to the variable outArdData
    outArdData.port10 = data.sval   
}

function outKnobPassed (data) {
    outArdData.port11 = data.kpval
}
function draw() {
    serial.write(outArdData.port10, outArdData.port11);//write that data to the arduino

    // map knob attached to arduino's value to background brightness
    var backgBrightness = map(inArdData, 0, 255, 0, 255);   // map input to the correct range of brightness
    console.log ('knob val: ' + backgBrightness);
    fill(backgBrightness);   // transfer the brightness to brightness of the color used for drawing
    rect(0,0,width,height);   // left half

    // grab arduino knob value and store it in the object data
    var data = {
        val: inArdData
    }
    // lead-to-follow: 1. emit message 'knob' and its data
    socket.emit('knobState', data);
    var textColour = map(backgBrightness, 0, 255, 255, 0);
    fill(textColour);
    textSize(18);
    text("KNOB VALUE: " + inArdData, 30, 50);
}

// Following functions print the serial communication status to the console for debugging purposes
function printList(portList) {
    // portList is an array of serial port names for Arduino
    for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
    }
   }
   
   function serverConnected() {
     print('connected to serial server.');
   }
   
   function portOpen() {
     print('the serial port opened.')
   }
   //read the serial data from the arduino and set the variable inArdData to equal it
   function serialEvent() {
     inArdData = Number(serial.read());
   }
   
   function serialError(err) {
     print('Something went wrong with the serial port. ' + err);
   }
   
   function portClose() {
     print('The serial port closed.');
   }
