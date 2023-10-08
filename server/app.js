var express = require('express');
var bodyParser = require('body-parser');

const GPIO_PI = require('pigpio').Gpio;
const { createLed } = require( './led.mjs');


 //stop blinking after 5 seconds
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var hostname = '192.168.0.41';
var port = 9000;

var ledList = [];

function makeStruct(led, cycle) {
  return {"led": led, "cycle": cycle};
}


app.get('/ledsOFF', function(req, res) {
  console.log('ledsOFF: ', ledList, ledList[0]);
  ledList.forEach(led => {
    console.log('led: ', led);
    led.cycle = clearInterval(led.cycle);
    led.led.pwmWrite(0);
  });
  res.send('ledsOFF');
});

app.get('/ledsOFF/v2', function(req, res) {
  console.log('ledsOFF: ', ledList, ledList[0]);
  ledList.forEach(led => {
    console.log('led: ', led);

    if(led.mode == LED_ACTION.CYCLE){
      led.action = clearInterval(led.action);
    }
    led.led.pwmWrite(0);
  });
  res.send('ledsOFF');
});

app.post('/led/v2', function(req, res) {
  
  let mode = req.body.mode;
  if(mode == 'INPUT'){
      mode = GPIO_PI.INPUT;
  } else {
      mode = GPIO_PI.OUTPUT;
  }

  const led = createLed(req.body.ledPin, mode, req.body.action);
  ledList.push(led);
  console.log('receiving data ...', ledList);
  console.log('body is ',req.body);
  res.send(req.body);
});


app.post('/led', function(req, res) {
    const ledPin = req.body.ledPin;
    let mode = req.body.mode;
    if(mode == 'INPUT'){
        mode = GPIO_PI.INPUT;
    } else {
        mode = GPIO_PI.OUTPUT;
    }
    const led = new GPIO_PI(ledPin, {mode: mode});
    let dutyCycle = 0;
    const cycle = setInterval(() => {
      led.pwmWrite(dutyCycle);
    
      dutyCycle += 5;
      if (dutyCycle > 255) {
        dutyCycle = 0;
      }
    }, 20);

    ledList.push(makeStruct(led, cycle));
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