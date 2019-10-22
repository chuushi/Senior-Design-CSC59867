
console.log("CSC 59867 - Team 1");

const AudioNetwork = require('audio-network');

//console.log(AudioNetwork);
const DataLinkLayer = require('./js/data-link-layer.js');

const AudioContext = require('audio-context');

// To satisfy audio-network import
global.window = {};
global.window.AudioContext = AudioContext;
global.navigator = {};

DataLinkLayer.init();

DataLinkLayer.onTxClick();

console.log("Exit");

