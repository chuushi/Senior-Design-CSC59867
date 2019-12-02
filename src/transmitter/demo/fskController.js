function(){

var freqs = [20500, 20350, 20200, 20050];
var context, o, g;
var high = 8000;
var low = 9000;
var interval = 500;
var v = false;	
var domButtons = document.getElementById("right-btn" "left-btn" "up-btn" "down-btn");


function run() {
    context = new AudioContext();
    o = context.createOscillator();
    g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
}

function stop() {o.stop();}
	
function f(n) {
    o.frequency.value = n;
    return o.frequency;
}

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
	
var hit = -1;
for (var i = 0; i < freqs.length; i++) {
    var e = document.createElement("input");
    e.setAttribute("type", "button");
    e.value = "Play " + freqs[i];
    e.dataset.index = i;
    
    e.onclick = function(e) {
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
   function touchHandler(event, action) {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        var x = touches[0].pageX,
            y = touches[0].pageY;
        switch(event.type) {
            case "touchstart": type = "mousedown"; break;
            case "touchmove":  type="mousemove"; break;        
            case "touchend":   type="mouseup"; break;
            default: return;
        }
   }

   function init(elem, action) {
        var element = document.getElementById(elem);
        element.addEventListener("touchstart", function(event) {
            touchHandler(event, action);
        }, true);
        element.addEventListener("touchmove", function(event) {
            touchHandler(event, action);
        }, true);
        element.addEventListener("touchend", function(event) {
            touchHandler(event, action);
        }, true);
        
        element.addEventListener("touchcancel", function(event) {
            touchHandler(event, action);
        }, true);  
   }

domButtons.addEventListener('touchstart', onmousedown, false);
domButtons.addEventListener('touchend', onmouseup, false);
domButtons.addEventListener('touchmove', onmousemove, false);
	
	
}