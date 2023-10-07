var express = require('express');
var bodyParser = require('body-parser');

const GPIO_PI = require('pigpio').Gpio;

 //stop blinking after 5 seconds
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var hostname = '192.168.0.41';
var port = 9000;

app.post('/led', function(req, res) {
    const ledPin = req.body.ledPin;
    let mode = req.body.mode;
    if(mode == 'INPUT'){
        mode = GPIO_PI.INPUT;
    } else {
        mode = GPIO_PI.OUTPUT;
    }
    const led = new GPIO_PI(ledPin, {mode: mode});

    setInterval(() => {
      led.pwmWrite(dutyCycle);
    
      dutyCycle += 5;
      if (dutyCycle > 255) {
        dutyCycle = 0;
      }
    }, 20);
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