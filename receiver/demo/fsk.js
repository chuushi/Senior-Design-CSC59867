(function(){
"use strict";

const player = document.getElementById('player');

const handleSuccess = function(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
        // Do something with the data, e.g. convert it to WAV
        console.log(e.inputBuffer);
        
    };
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(handleSuccess);

document.getElementById("instart").onclick = function() {
//    var n = document.getElementById("inval").value;
//    send(n);  
}


}())