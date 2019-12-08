const Gpio = require('onoff').Gpio;

// Set each pins for each direction of the vehicle
const move = {
    left: new Gpio(20, 'out'),
    right: new Gpio(26, 'out'),
    forward: new Gpio(19, 'out'),
    backward: new Gpio(16, 'out')
}

// === main class function ===
const out = function out( direction ) {
    switch (direction) {
        case "none": // none: turn everything off
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

        case "reverse":
        move.forward.writeSync(0);
        move.backward.writeSync(1);
            break;
        
        case "stand": // when vehicle is not moving
        move.forward.writeSync(0);
        move.backward.writeSync(0);
            break;
        
        case "straight": // when vehicle is not steering
        move.left.writeSync(0);
        move.right.writeSync(0);
            break;
    }
    
}

// When the process exists, release the pins from this program's control
process.on('SIGINT', _ => {
  move.left.unexport();
  move.right.unexport();
  move.forward.unexport();
  move.backward.unexport();
});

module.exports = out;
