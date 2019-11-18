
console.log("CSC 59867 - Team 1");

const AirSocket = require('airsocket');
const mic = require('mic')


navigator.getUserMedia({ audio: true}, function(e){
  var socket = new AirSocket({audioSource: e});
  socket.on('message', function(m){
    alert(m.data); // m is a MessageEvent, just like with WebSocket
  });
  socket.send('hello world!');
}, function(err){console.log(err)});

/*
var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
});

// you should polyfill getUserMedia
var socket = new AirSocket({audioSource: micInstance.getAudioStream()});

socket.on('message', function(m){
    console.log(m.data); // m is a MessageEvent, just like with WebSocket
});

//socket.send('hello world!');
// NOTE: I'm using semicolons just to appease you. ;)
*/

console.log("Exit");

