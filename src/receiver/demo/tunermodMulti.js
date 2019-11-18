#!/usr/bin/env node

const Goertzel = require('goertzeljs');
const Mic = require('mic');
const detectPitch = require('detect-pitch');

// ===== CONFIGS ===== //
const rate = 41000;
const freqs = [20500, 20200, 19900, 19500];
const sigs = [5, 5, 5, 5];
const showDebug = true;

// ===== END CONFIGS ===== //

function bufferToFreq (rate, b) {
  const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
  return parseFloat((rate / detectPitch(wf, 0.2)).toFixed(2))
}

const mic = Mic({
  rate: rate,
  channel: 1,
  bitwidth: 16,
  encoding: 'unsinged-integer'
});

const goertzel = new Goertzel({
  frequencies: freqs,
  sampleRate : rate
});

const stream = mic.getAudioStream()

stream.on('error', e => {
  console.error(e);
  process.exit(1);
});


var fStr = [];

for (var i = 0; i < freqs.length; i++) {
  fStr[i] = freqs[i].toString();
}

let count = 0;
    index = -1;

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
    return;
  }

  
  if (index != highIndex)
    count = 1;
  else
    count++;

  index = highIndex;
  console.log("Rx:\t" + freqs[index] + "\t" + count + "\t" + energies[index]);

})


mic.start()

