var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

var socket;

var slider;

var remoteKnob = 0;

var img;

var colours = [];

// The currently selected sorting mode is always stored in the
//variable sortMode. The default is to not sort, and the value 
//is therefore set at null (undefined)
//var sortMode = null;

//Before the program starts to run, the image for background is loaded and stored into the variable called img.
function preload() {
  img = loadImage("media/CRT_graveyard.jpg")
}

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
    
    //.loadPixels() accesses individual pixels of image
    img.loadPixels();
    colours = [];

    //connect to server
    socket = io();
    
    socket.on('connect', function onConnect(){
        console.log('socket.io connection made.');
      });

    //lead-to-follow: 4. listen for 'remoteKnob' messages and setup event handler (function 'LEDBrightness')
    socket.on('remoteKnob', remoteKnobListener);
}

function remoteKnobListener(data) {
    //lead-to-follow: 5. map the incoming remoteKnob message's data to the variable leadknobValness
    remoteKnob = data.val
    console.log('remote knob val: ' + remoteKnob)

}

function draw() {
    var leadknobVal = map(remoteKnob, 0, 255, 0, 255);
    console.log(leadknobVal)
    //fill(leadknobVal);
    //rect(0,0,width,height);

    // draw the text
    var sliderValue = slider.value()
    var textColour = map(leadknobVal, 0, 255, 255,0);
    fill(textColour);
    textSize(18);
    text("REMOTE KNOB VALUE: " + leadknobVal, 30, 50);
    text("VIRTUAL SLIDER VALUE: " + sliderValue, 30, 20);

    //The number of rows and columns in the grid tileCount depends on leadknobVal.
    //The function max() selects the larger of the two given values.
    var tileCount = floor(width / max(leadknobVal, 1));
    //The grid resolution just calculated is now used to define the size of the tiles, rectSize.
    var rectSize = width / tileCount;

    colours = [];

    //The image is scanned line by line in the previously calculated grid spacing, rectSize.
    //The pixels are stored in the pixels[] array as a long list of values. 
    for (var gridY = 0; gridY < tileCount; gridY++) {
      for (var gridX = 0; gridX < tileCount; gridX++) {
        //Therefore, from px and py, the corresponding index i must be calculated.
        var px = int(gridX * rectSize);
        var py = int(gridY * rectSize);
        var i = (py * img.width + px) * 4;
        var c = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]);
        colours.push(c);
      }
    }
    //The colors are sorted using the sortColors() function. This function must pass the array colors and sort mode sortMode.
   // gd.sortColors(colours, sortMode);

   //In order to draw the palette, the grid is processed again. The fill colors for the tiles are taken, value by value, from the array colours.
    var i = 0;
    for (var gridY = 0; gridY < tileCount; gridY++) {
      for (var gridX = 0; gridX < tileCount; gridX++) {
        fill(colours[i]);
        rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
        i++;
      }
    }

    // draw the text
    var sliderValue = slider.value()
    var textColour = map(leadknobVal, 0, 255, 255,0);
    fill(textColour);
    textSize(18);
    text("REMOTE KNOB VALUE: " + leadknobVal, 30, 50);
    text("VIRTUAL SLIDER VALUE: " + sliderValue, 30, 20);


    // grab arduino knob value and store it in the object data
    var data = {
        val: sliderValue,
    }
    // lead-to-follow: 1. emit message 'knob' and its data
    socket.emit('slideState', data);
}

function setImage(loadedImageFile) {
  img = loadedImageFile;
}
