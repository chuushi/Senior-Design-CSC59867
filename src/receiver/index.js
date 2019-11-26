const AudioLayer = require('./audio-layer.js');
const Gpio = require('./gpio-layer.js');

const a = new AudioLayer();

a.on('data', d => {
    if (d.length == 0)
        return;
    
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
    
});

a.start();