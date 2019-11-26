const Goertzel = require('goertzeljs');
const Mic = require('mic');
const detectPitch = require('detect-pitch');
const Events = require('events');

// ===== CONFIGS ===== //
const rate = 41000;
const freqs = [20500, 20350, 20200, 20050];
const sigs = [5, 5, 5, 5];
const showDebug = true;
// ===== END CONFIGS ===== //

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

    this.stream.on('data', b => {
      
    this.goertzel.refresh();
    
    // Convert input buffer data into frequencies and process them in goertzel
    const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
    const _this = this;
    wf.forEach(function(sample) {
        _this.goertzel.processSample(sample);
    });

    // Get the energies, and prepare to find the highest index
    var energies = [this.goertzel.energies[fStr[0]].toFixed(sigs[0])];
    var highIndex = 0;

    for (var i = 1; i < freqs.length; i++) {
        energies[i] = this.goertzel.energies[fStr[i]].toFixed(sigs[i]);
        if (energies[highIndex] < energies[i])
            highIndex = i;
    }

    // This means none of the frequencies exceeded the required threshold
    if (energies[highIndex] == 0.0) {
        index = -1;
        if (showDebug)
            console.log("NO DATA\t" + bufferToFreq(rate, b));
        this.ev.emit('data', []);
        return;
    }

      
    if (index != highIndex)
        count = 1;
    else
        count++;

    index = highIndex;
    if (showDebug)
        console.log("Rx:\t" + freqs[index] + "\t" + count + "\t" + energies[index]);
    this.ev.emit('data', [index]);

    });
    
    this.mic.start();
}

AudioLayer.prototype.stop = function() {
    this.mic.stop();
}

module.exports = AudioLayer;

