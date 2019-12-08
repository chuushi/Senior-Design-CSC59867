const Goertzel = require('goertzeljs');
const Mic = require('mic');
const detectPitch = require('detect-pitch');
const Events = require('events');

// load configurations
const config = require('../../config.js'),
    rate = config.rate,
    freqs = config.freqs,
    sigs = config.sigs,
    showDebug = config.showDebug;

// Simple function to get approximate dominant frequency from buffer
function bufferToFreq (rate, b) {
  const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
  return parseFloat((rate / detectPitch(wf, 0.2)).toFixed(2))
}

var fStr = [];

// the main class: AudioLayer Class
const AudioLayer = function() {
    // set up Mic
    this.mic = Mic({
        rate: rate,
        channel: 1,
        bitwidth: 16,
        encoding: 'unsinged-integer'
    });
    
    // set up Goertzel
    this.goertzel = new Goertzel({
        frequencies: freqs,
        sampleRate : rate
    });

    // Turn each frequency integers to string for parsing in Goertzel call later
    for (var i = 0; i < freqs.length; i++) {
      fStr[i] = freqs[i].toString();
    }
    
    // set up Event
    this.ev = new Events.EventEmitter();
    this.stream;
    
    return this;
}

let count = 0;
    index = -1;

// start member function: starts listening to and parsing the input audio from microphone
AudioLayer.prototype.start = function() {
    this.stream = this.mic.getAudioStream();
    
    this.stream.on('error', e => {
        console.error(e);
        process.exit(1);
    });

    this.stream.on('data', b => this._parseStream(b));
    this.mic.start();
}

// stop member function: stops the microphone from listening
AudioLayer.prototype.stop = function() {
    this.mic.stop();
}

// parseStream private member function: parses data from microphone; called from start()
AudioLayer.prototype._parseStream = function(b) {
    this.goertzel.refresh();
    
    // Convert input buffer data into frequencies and process them in goertzel
    const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
    const _this = this;
    wf.forEach(function(sample) {
        _this.goertzel.processSample(sample);
    });

    // Get energyData parsed
    var energyData = [];
    for (var i = 0; i < freqs.length; i++) {
        // create new entries for energyData
        energyData.push({
            index: i,
            freq: freqs[i],
            energy: this.goertzel.energies[fStr[i]].toFixed(sigs[i])
        });
    }
    
    // Sort energyData
    energyData.sort((a, b) => (a.energy > b.energy) ? -1 : 1);

    // This means none of the frequencies exceeded the required threshold
    if (energyData[0].energy == 0.0) {
        index = -1;
        if (showDebug)
            console.log("NO DATA\t" + bufferToFreq(rate, b));
        this.ev.emit('data', []);
        return;
    }
    // remove all zero-energy data
    for (var i = energyData.length - 1; i >= 0; i--) {
        if (energyData[i].energy == 0.0)
            energyData.splice(i, 1);
    }
    
    var e0 = energyData[0];
    
    // count how many times the same frequency has been heard
    if (index != e0.index)
        count = 1;
    else
        count++;

    index = e0.index;
    if (showDebug)
        console.log("Rx:\t" + e0.freq + "\t" + count + "\t" + e0.energy);
    this.ev.emit('data', energyData);
}

module.exports = AudioLayer;

