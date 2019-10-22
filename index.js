
console.log("CSC 59867 - Team 1");

const AirSocket = require('airsocket');
const GetUserMedia = require('getusermedia');

// you should polyfill getUserMedia
GetUserMedia({ audio: true}, function(e){
    var socket = new AirSocket({audioSource: e});
    socket.on('message', function(m){
        alert(m.data); // m is a MessageEvent, just like with WebSocket
    });
    socket.send('hello world!');
}, function(err){console.log(err)});

console.log("Exit");

