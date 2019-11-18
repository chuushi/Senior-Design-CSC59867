(function(){
"use strict";

// ===== CONFIG ===== //
var freqs = [20500, 20000, 19500, 19000];
// ===== CONFIG ===== //

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
var interval = 500;

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

var domButtons = document.getElementById("buttons");

var hit = -1;
for (var i = 0; i < freqs.length; i++) {
    var e = document.createElement("input");
    e.setAttribute("type", "button");
    e.value = "Play " + freqs[i];
    e.dataset.index = i;
    
    e.onclick = function() {
        var j = this.dataset.index;
        if (hit == j) {
            hit = -1;
            stop();
            v = false;
            return;
        }
        if (!v) {
            run();
            v = true;
        }
        hit = j;
        f(freqs[j]);
    }
    
    domButtons.appendChild(e);    
}

}())