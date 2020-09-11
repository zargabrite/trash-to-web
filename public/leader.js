function setup() {
  createCanvas(displayWidth,displayHeight);
  background(51);

  socket = io.connect()

  //recieve the message called 'mouse' back from the server and setup event handler (function 'newDrawing')
  socket.on('mouse', newDrawing);
}

//function 'newDrawing' is called, and details of event handling are outlined
function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
  //in the console print mouseDragged x,y data
  console.log(mouseX + ',' + mouseY);

  //1. data that the message will contain, in this case mouse x,y
  var data = {
    x: mouseX,
    y: mouseY
  }

  //1. send the message ('nameofmessage', data)
  socket.emit('mouse', data);

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 36, 36);
}

function draw() {

}
