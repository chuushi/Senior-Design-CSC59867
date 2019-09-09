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

var low = 880;
var high = 440;
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


}())