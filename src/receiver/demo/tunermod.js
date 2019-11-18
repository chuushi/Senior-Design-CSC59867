#!/usr/bin/env node

// const { FrequencyTable, createMic, bufferToFreq } = require('my-tuner');
const Goertzel = require('goertzeljs');
const Mic = require('mic');

// const ft = new FrequencyTable(3, 5);

// ===== CONFIGS ===== //
const rate = 41000;
const mark = 8000;
const markSig = 3;
const space = 9000;
const spaceSig = 3;

// ===== END CONFIGS ===== //

const mic = Mic({
  rate: rate,
  channel: 1,
  bitwidth: 16,
  encoding: 'unsinged-integer'
});

const goertzel = new Goertzel({
  frequencies: [mark, space],
  sampleRate : rate
});

const stream = mic.getAudioStream()

stream.on('error', e => {
  console.error(e);
  process.exit(1);
});


var mStr = mark.toString(),
    sStr = space.toString();
let count = 0;
    type = 0;

stream.on('data', b => {
//  const hz = bufferToFreq(rate, b);
//  console.log(hz);

  goertzel.refresh();
  const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);
  wf.forEach(function(sample) {
    goertzel.processSample(sample);
  });

  markFreq  = goertzel.energies[mStr].toFixed(markSig);
  spaceFreq = goertzel.energies[sStr].toFixed(spaceSig);
//  console.log(markFreq);
//  console.log(spaceFreq);
  
  if (markFreq > spaceFreq) {
    if (type != 2) {
      type = 2;
      count = 1;
    } else
      count++;
    console.log("MARK  " + count);
    // is mark
  } else if (spaceFreq > markFreq) {
    if (type != 1) {
      type = 1;
      count = 1;
    } else
      count++;
    console.log("SPACE " + count);
    // is space
  } else {
    type = 0;
    // nothing
  }

})


mic.start()

