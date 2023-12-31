/**
 * @fileoverview This file contains the functions for the led.
 * @module server/led
 */
const LED_ACTION = {
    ON: 'ON',
    OFF: 'OFF',
    BLINK: 'BLINK',
    CYCLE: 'CYCLE'
};


function cycleLight(led){
    let dutyCycle = 0;
    return setInterval(() => {
        led.pwmWrite(dutyCycle);
      
        dutyCycle += 5;
        if (dutyCycle > 255) {
          dutyCycle = 0;
        }
      }, 20);
};


function setAction(action, led) {
    switch(action) {
        case LED_ACTION.ON:
            led.pwmWrite(255);
            break;
        case LED_ACTION.OFF:
            led.pwmWrite(0);
            break;
        case LED_ACTION.BLINK:
            cycleLight(led);
            break;
        case LED_ACTION.CYCLE:
            return cycleLight(led);
    }
};


function createLed(pin, mode, action, GPIO_PI) {
    const led = new GPIO_PI(pin, {mode: mode});
    return {
        "led": led,
        "pin": pin,
        "mode": mode,
        "action": setAction(action, led)
    }
}

module.exports = {
    createLed,
    setAction,
    cycleLight,
    LED_ACTION
};
