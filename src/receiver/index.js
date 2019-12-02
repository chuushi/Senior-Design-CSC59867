const AudioLayer = require('./audio-layer.js');
const Gpio = require('./gpio-layer.js');

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
        case 2:
            Gpio('backward');
        case 3:
            Gpio('left');
        case 4:
            Gpio('right');
        case 0:
        default:
            Gpio('none');
    }
    console.log(d);
});

a.start();
