(function(){
"use strict";

var freqs = window.config.freqs;

var context, o, g;

function run() {
    context = new AudioContext();
    o = context.createOscillator();
    g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
}

var timeoutQueue = null;
var running = false;

function stop() {
    f(freqs[0]);
    timeoutQueue = setTimeout(function() {
        timeoutQueue = null;
        o.stop();
        running = false;
    }, 2000);
    //g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.0001)
}

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

var high = 8000;
var low = 9000;
var interval = 500;

var v = false;


var domButtons = document.getElementById("buttons");

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