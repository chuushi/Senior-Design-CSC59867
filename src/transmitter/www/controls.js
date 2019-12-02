(function(){
"use strict";

var freqs = [20500, 20350, 20200, 20050];
var btnTable = document.getElementById("arrows");

function dataHandler(direction) {
    if (direction == null)
        window.soundLayer();
    window.soundLayer(direction);
    document.getElementById("debug").innerHTML = direction;
}

var btns = btnTable.getElementsByClassName("arrow");

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("touchstart", onDown);
    btns[i].addEventListener("mousedown", onDown);
    // todo:  implement touchmove maybe?
    //btns[i].addEventListener("touchmove", onMove);
    btns[i].addEventListener("touchend", onUp);
    btns[i].addEventListener("touchcancel", onUp);
    btns[i].addEventListener("mouseup", onUp);
    btns[i].addEventListener("mouseout", onUp);
}

var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

window.addEventListener("keydown", event => {
    switch (event.keyCode) {
    case 37: // left
        keys.left = true;
        break;
    case 38: // up
        keys.up = true;
        break;
    case 39: // right
        keys.right = true;
        break;
    case 40: // down
        keys.down = true;
        break;
    default:
        return;
    }
    parseKey();
});

window.addEventListener("keyup", event => {
    switch (event.keyCode) {
    case 37: // left
        keys.left = false;
        break;
    case 38: // up
        keys.up = false;
        break;
    case 39: // right
        keys.right = false;
        break;
    case 40: // down
        keys.down = false;
        break;
    default:
        return;
    }
    parseKey();
});

function parseKey() {
    if (keys.up == keys.down) {
        dataHandler(null);
        return;
    }
    
    if (keys.up) {
        if (keys.left == keys.right)
            dataHandler("forward");
        else if (keys.left)
            dataHandler("forward-left");
        else if (keys.right)
            dataHandler("forward-right");
    } else if (keys.down) {
        if (keys.left == keys.right)
            dataHandler("reverse");
        else if (keys.left)
            dataHandler("reverse-left");
        else if (keys.right)
            dataHandler("reverse-right");
    }
}

var activeBtn;

function onDown(e) {
    activeBtn = e.target;
    dataHandler(activeBtn.dataset.dir);
    e.preventDefault();
}

function onUp(e) {
    if (activeBtn != e.target)
        return;
    
    dataHandler(null);
    activeBtn = null;
    e.preventDefault();
}

/*
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
*/
}())