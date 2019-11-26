const Gpio = require('onoff').Gpio;

const move = {
    left: new Gpio(20, 'out'),
    right: new Gpio(26, 'out'),
    forward: new Gpio(19, 'out'),
    backward: new Gpio(16, 'out')
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
        move.left.writeSync(1);
        move.right.writeSync(0);
            break;

        case "right":
        move.left.writeSync(0);
        move.right.writeSync(1);
            break;
        case "forward":
        move.forward.writeSync(1);
        move.backward.writeSync(0);
            break;

        case "backward":
        move.forward.writeSync(0);
        move.backward.writeSync(1);
            break;
        
        case "stand":
        move.forward.writeSync(0);
        move.backward.writeSync(0);
            break;
        
        case "no-steer":
        move.left.writeSync(0);
        move.right.writeSync(0);
            break;
    }
    
}

process.on('SIGINT', _ => {
  move.left.unexport();
  move.right.unexport();
  move.forward.unexport();
  move.backward.unexport();
});

module.exports = out;
