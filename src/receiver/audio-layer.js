const Goertzel = require('goertzeljs');
const Mic = require('mic');
const detectPitch = require('detect-pitch');
const Events = require('events');

const config = require('../../config.js'),
    rate = config.rate,
    freqs = config.freqs,
    sigs = config.sigs,
    showDebug = config.showDebug;

function bufferToFreq (rate, b) {
  const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
  return parseFloat((rate / detectPitch(wf, 0.2)).toFixed(2))
}

var fStr = [];

const AudioLayer = function() {
    this.mic = Mic({
      rate: rate,
      channel: 1,
      bitwidth: 16,
      encoding: 'unsinged-integer'
    });
    
    this.goertzel = new Goertzel({
      frequencies: freqs,
      sampleRate : rate
    });

    for (var i = 0; i < freqs.length; i++) {
      fStr[i] = freqs[i].toString();
    }
    
    this.ev = new Events.EventEmitter();
    this.stream;
    
    return this;
}

let count = 0;
    index = -1;

AudioLayer.prototype.start = function() {
    this.stream = this.mic.getAudioStream();
    
    this.stream.on('error', e => {
        console.error(e);
        process.exit(1);
    });

    this.stream.on('data', this._parseStream);
    this.mic.start();
}

AudioLayer.prototype.stop = function() {
    this.mic.stop();
}

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
    } else {
        // remove all zero-energy data
        energyData.forEach(function(d, i, o) {
            if (d.energy == 0.0) {
                o.splice(i, 1);
            }
        });
        
        var e0 = energyData[0];
        
        if (index != e0.index)
            count = 1;
        else
            count++;

        index = e0.index;
        if (showDebug)
            console.log("Rx:\t" + e0.freq + "\t" + count + "\t" + e0.energy);
    }
    this.ev.emit('data', energyData);
}

module.exports = AudioLayer;

