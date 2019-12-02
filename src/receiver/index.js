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
    if (d[0] == 0)
        Gpio('none');
    else if (d[0] == 1)
        Gpio('left');
    else if (d[0] == 2)
        Gpio('right');
    else if (d[0] == 3)
        Gpio('forward');
    else if (d[0] == 4)
        Gpio('backward');
    console.log(d[0]);
});

a.start();
