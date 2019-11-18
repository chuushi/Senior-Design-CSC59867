const Gpio = require('onoff').Gpio;

const move = {
    left: new Gpio(17, 'out'),
    right: new Gpio(17, 'out'),
    forward: new Gpio(17, 'out'),
    backward: new Gpio(17, 'out')
}

const out = function out( direction ) {
    switch (direction) {
        case "none":
            move.left.writeSync(0);
            move.right.writeSync(0);
            move.forward.writeSync(0);
            move.backward.writeSync(0);
            break;
        case "left":
            break;
        case "right":
            break;
        case "forward":
            break;
        case "backward":
    }
    
}

process.on('SIGINT', _ => {
  move.left.unexport();
  move.right.unexport();
  move.forward.unexport();
  move.backward.unexport();
});

module.exports = out;
