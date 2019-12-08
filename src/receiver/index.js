const AudioLayer = require('./audio-layer.js');
const Gpio = require('./gpio-layer.js');
const debug = require('../../config.js').showDebug;

console.log("CSC 59867 - Team 1");
console.log("Receiver - Vehicle Control Portion");

const a = new AudioLayer();

let counter = 0;

// Set up event: when "data" event is fired...
a.ev.on('data', d => {
    // If there is no data (not enough power in each frequency)
    if (d.length == 0) {
        // If there is no data for over four consective iterations,
        //   then the vehicle will stop on its own.
        if (++counter > 4)
            Gpio('none');
        return;
    }
    
    counter = 0;
    switch (d[0].index) {
        case 1:
            Gpio('forward');
            Gpio('straight');
            break;
        case 2:
            Gpio('forward');
            Gpio('left');
            break;
        case 3:
            Gpio('forward');
            Gpio('right');
            break;
        case 4:
            Gpio('reverse');
            Gpio('straight');
            break;
        case 5:
            Gpio('reverse');
            Gpio('left');
            break;
        case 6:
            Gpio('reverse');
            Gpio('right');
            break;
        case 0:
        default:
            Gpio('none');
    }
    if (debug)
        console.log(d);
});

// Start listening to mic
a.start();
