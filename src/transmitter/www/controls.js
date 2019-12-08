(function(){
"use strict";

// === dataHandler - run every time the vehicle direction changes ===
function dataHandler(direction) {
    window.soundLayer(direction);
    document.getElementById("debug").innerHTML = direction;
}

// === Attach click/touch events to all arrow control buttons ===
var btns = document.getElementById("arrows").getElementsByClassName("arrow");
var activeBtn;

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("touchstart", onDown);
    btns[i].addEventListener("mousedown", onDown);
    btns[i].addEventListener("touchend", onUp);
    btns[i].addEventListener("touchcancel", onUp);
    btns[i].addEventListener("mouseup", onUp);
    btns[i].addEventListener("mouseout", onUp);
}

// Run on GUI button presses
function onDown(e) {
    activeBtn = e.target;
    dataHandler(activeBtn.dataset.dir);
    e.preventDefault();
}

// Run on GUI button releases
function onUp(e) {
    if (activeBtn != e.target)
        return;
    
    dataHandler(null);
    activeBtn = null;
    e.preventDefault();
}

// === Attach keyboard events to up, down, left, and right keys ===
// Keyboard toggle list: true if pressed, false if released
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Register physical key press events
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

// Register physical key release events
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

// Run proper handler for each key
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

}())