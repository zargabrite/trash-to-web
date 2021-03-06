var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

var socket;

var slider;

var remoteKnob = 0;

function setup() {
    // set the canvas to match the window size
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
    slider = createSlider(0, 255, 0); // indicate the value range for slider
    slider.position(width/2 + (width/2-300)/2 , height-100);
    slider.style('width', '300px');
    
    //connect to server
    socket = io();
    
    socket.on('connect', function onConnect(){
        console.log('now connected to the server.');
      });

    //lead-to-follow: 4. listen for 'remoteKnob' messages and setup event handler (function 'LEDBrightness')
    socket.on('remoteKnob', remoteKnobListener);
}

function remoteKnobListener(data) {
    //lead-to-follow: 5. map the incoming remoteKnob message's data to the variable backgBrightness
    remoteKnob = data.val
    console.log('remote knob val: ' + remoteKnob)

}

function draw() {
    var backgBright = map(remoteKnob, 0, 255, 0, 255);
    console.log(backgBright)
    fill(backgBright);
    rect(0,0,width,height);

    // draw the text
    var sliderValue = slider.value()
    var textColour = map(backgBright, 0, 255, 255,0);
    fill(textColour);
    textSize(18);
    text("REMOTE KNOB VALUE: " + backgBright, 30, 50);
    text("VIRTUAL SLIDER VALUE: " + sliderValue, 30, 20);
    // grab arduino knob value and store it in the object data
    var data = {
        sval: sliderValue,
        kpval: remoteKnob
    }
    // lead-to-follow: 1. emit message 'knob' and its data
    socket.emit('slideState', data);
    // pass back the remoteKnob value to leader.js
    socket.emit('knobPass', data); 
}
