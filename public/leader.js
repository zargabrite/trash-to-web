//display setup variables
var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

//arduino serial port related variables
var serial;   // variable to hold an instance of the serialport library
var portName = 'COM3';    // fill in your serial port name here
var inArdData;   // variable to hold the input data from Arduino
var outArdData; // for data output

var slider;
var sliderValue;

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

    //setup slider stuff
    slider = createSlider(0, 255, 0); // indicate the value  range for slider
    slider.position(width/2 + (width/2-300)/2, height-100);
    slider.style('width', '300px');

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
    socket = io.connect()

    socket.on('connect', function onConnect(){
      console.log('now connected to the server.');
    });

    //follow-to-lead 4. recieve the message called 'LEDVal' from the server and setup event handler (function 'LEDBrightness')
    socket.on('LEDstate', LEDBrightness);
}

function LEDBrightness(data) {
    //follow-to-lead: 5. map the incoming LEDVal message's data to the variable outArdData.p10
    outArdData = data.val
    console.log(outArdData);
    serial.write(500+","+outArdData+","+501+","+92+"\n");//write that data to the arduino
}

function draw() {
    // map knob attached to arduino's value to background brightness
    var backgBrightness = map(inArdData, 0, 255, 0, 255);   // map input to the correct range of brightness
    //console.log ('knob val: ' + backgBrightness);
    fill(backgBrightness);   // transfer the brightness to brightness of the color used for drawing
    rect(0,0,width,height);   // left half

    // grab arduino knob value and store it in the object data
    var data = {
        val: inArdData
    }
    // lead-to-follow: 1. emit message 'knob' and its data
    socket.emit('knobState', data);

    //draw the text
    sliderValue = slider.value();
    var textColour = map(backgBrightness, 0, 255, 255, 0);
    fill(textColour);
    textSize(18);
    text("KNOB VALUE: " + inArdData, 30, 50);
    text("VIRTUAL SLIDER VALUE: " + sliderValue, 30, 20);
    //outArdData.p11 = sliderValue;
    
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
