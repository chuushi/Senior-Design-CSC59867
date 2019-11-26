const Goertzel = require('goertzeljs');
const Mic = require('mic');
const detectPitch = require('detect-pitch');
const Events = require('events');

// ===== CONFIGS ===== //
const rate = 41000;
const freqs = [20500, 20000, 19500, 19000];
const sigs = [5, 5, 5, 5];
const showDebug = true;
// ===== END CONFIGS ===== //

class AudioEvent extends Events {}

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
    
    this.event = new AudioEvent();
    this.on = event.on;
    this.stream;
    
    return this;
}

let count = 0;
    index = -1;

AudioLayer.prototype.start = function() {
    this.stream = mic.getAudioStream();
    
    stream.on('error', e => {
        console.error(e);
        process.exit(1);
    });

    stream.on('data', b => {
      
    goertzel.refresh();

    // Convert input buffer data into frequencies and process them in goertzel
    const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
    wf.forEach(function(sample) {
        goertzel.processSample(sample);
    });

    // Get the energies, and prepare to find the highest index
    var energies = [goertzel.energies[fStr[0]].toFixed(sigs[0])];
    var highIndex = 0;

    for (var i = 1; i < freqs.length; i++) {
        energies[i] = goertzel.energies[fStr[i]].toFixed(sigs[i]);
        if (energies[highIndex] < energies[i])
            highIndex = i;
    }

    // This means none of the frequencies exceeded the required threshold
    if (energies[highIndex] == 0.0) {
        index = -1;
        if (showDebug)
            console.log("NO DATA\t" + bufferToFreq(rate, b));
        this.event.emit('data', []);
        return;
    }

      
    if (index != highIndex)
        count = 1;
    else
        count++;

    index = highIndex;
    if (showDebug)
        console.log("Rx:\t" + freqs[index] + "\t" + count + "\t" + energies[index]);
    this.event.emit('data', [index]);

    });
    
    this.mic.start();
}

AudioLayer.prototype.stop = function() {
    this.mic.stop();
}

module.exports = AudioLayer;

