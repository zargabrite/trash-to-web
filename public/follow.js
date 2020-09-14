var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

var slider;

var backgBrightness;

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
    const socket = io.connect(printConnection);

    //lead-to-follow: 4. listen for 'remoteKnob' messages and setup event handler (function 'LEDBrightness')
    socket.on('remoteKnob', backgroundBrightness);
}

function printConnection () {
    print('connected to server.')
}

function backgroundBrightness(data) {
    //lead-to-follow: 5. map the incoming remoteKnob message's data to the variable backgBrightness
    backgBrightness = data.val
    print(data.val);
}

function draw() {
    fill(backgBrightness);
    rect(width,0,width,height);

    // draw the text
    var textRColor = map(backgBrightness, 0, 255, 255,0);
    fill(textRColor);
    textSize(16);
    text("REMOTE KNOB VALUE: " + backgBrightness, width - 170, 50);

    // grab arduino knob value and store it in the object data
    var data = {
        //!!!this may need to be map()'d to properly control LED brightness.!!!
        val: slider.value()
    }
    // lead-to-follow: 1. emit message 'knob' and its data
    socket.emit('slideState', data);
}
