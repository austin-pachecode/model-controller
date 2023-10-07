var express = require('express');
var bodyParser = require('body-parser');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

 //stop blinking after 5 seconds
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var hostname = '192.168.0.41';
var port = 9000;

app.post('/led', function(req, res) {
    blinkLED();
    setTimeout(endBlink, 5000);
    console.log('receiving data ...');
    console.log('body is ',req.body);
    res.send(req.body);
});

app.get('/', (req, res) => {
  res.send('root')
})
// start the server
app.listen(port, hostname);
console.log('Server started! At http://localhost:' + port);