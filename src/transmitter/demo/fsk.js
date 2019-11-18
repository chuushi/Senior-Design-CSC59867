(function(){
"use strict";

var context, o, g;

function run() {
    context = new AudioContext();
    o = context.createOscillator();
    g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
}

function stop() {
    o.stop();
    //g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.0001)
}

function f(n) {
    o.frequency.value = n;
    return o.frequency;
}

var high = 8000;
var low = 9000;
var interval = 200;

var v = false;

function send(n) {
    if (!v) {
        run();
        v = true;
    }

    var s = n & 1;
    
    if (s) {
        f(high);
    } else {
        f(low);
    }

    var nn = n >> 1;
    if (nn == 0) {
        setTimeout(stop, interval);
        v = false;
        return;
    }
    
    setTimeout(send, interval, nn);
}

document.getElementById("instart").onclick = function() {
    var n = document.getElementById("inval").value;
    send(n);  
}

var highToggle = false;
var lowToggle = false;

document.getElementById("high").onclick = function() {
    lowToggle = false;
    if (highToggle) {
        highToggle = false;
        stop();
        v = false;
        return;
    }
    if (!v) {
        run();
        v = true;
    }
    highToggle = true;
    f(high);
}

document.getElementById("low").onclick = function() {
    highToggle = false;
    if (lowToggle) {
        lowToggle = false;
        stop();
        v = false;
        return;
    }
    if (!v) {
        run();
        v = true;
    }
    lowToggle = true;
    f(low);
}

}())