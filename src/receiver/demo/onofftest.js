const Gpio = require('onoff').Gpio; // Gpio class

const led = new Gpio(17, 'out');
const idk = new Gpio(4, 'out');

idk.writeSync(1);

// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 1000);
const id = setInterval(_ => idk.writeSync(idk.readSync() ^ 1), 1000);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  clearInterval(id);
  led.unexport();    // Unexport GPIO and free resources
  idk.unexport();
}, 10000);

