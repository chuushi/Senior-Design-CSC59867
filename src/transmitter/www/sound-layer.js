(function(){
"use strict";

var freqs = window.config.freqs;
var timeoutQueue = null;
var running = false;
var context, o, g;

// Starts sound engine
function run() {
    context = new AudioContext();
    o = context.createOscillator();
    g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
}

// Stops sound engine
function stop() {
    f(freqs[0]);
    // timeoutQueue: set when the sound engine is about to shut down.
    //   This is cancellable later when another sound frequency is to be played.
    timeoutQueue = setTimeout(function() {
        timeoutQueue = null;
        o.stop();
        running = false;
    }, 2000);
    // gradual shut down line; we didn't implement it in case there exists a timing issue
    //g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.0001)
}

// Changes which sound frequency is played
function f(n) {
    if (!running) {
        run();
        running = true;
    }
    if (timeoutQueue) {
        clearTimeout(timeoutQueue);
        timeoutQueue = null;
    }
    o.frequency.value = n;
    return o.frequency;
}

// === soundLayer: global function for playing certain sound frequency based on direction
window.soundLayer = function(dir) {
    if (dir == null)
        stop();
    
    else switch (dir) {
    case "forward":
        f(freqs[1]);
        break;
    case "forward-left":
        f(freqs[2]);
        break;
    case "forward-right":
        f(freqs[3]);
        break;
    case "reverse":
        f(freqs[4]);
        break;
    case "reverse-left":
        f(freqs[5]);
        break;
    case "reverse-right":
        f(freqs[6]);
        break;
    default:
        stop();
    }
}

}())