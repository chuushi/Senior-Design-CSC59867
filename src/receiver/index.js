const AudioLayer = require('./audio-layer.js');
const Gpio = require('./gpio-layer.js');
const debug = require('../../config.js').debug;

const a = new AudioLayer();

let counter = 0;

a.ev.on('data', d => {
    if (d.length == 0) {
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

a.start();
