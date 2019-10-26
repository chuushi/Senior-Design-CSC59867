#!/usr/bin/env node

const { FrequencyTable, createMic, bufferToFreq } = require('my-tuner');
const Goertzel = require('goertzeljs');
const Mic = require('mic');

const ft = new FrequencyTable(3, 5);

const rate = 48000;

const mark = 400;
const space = 600;

const mic = Mic({
  rate,
  channel: 1,
  bitwidth: 16,
  encoding: 'signed-integer'
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


let silence = 0
stream.on('data', b => {
  const hz = bufferToFreq(rate, b);

  silence++;
  if (silence >= 5) {
  }
  console.log(hz);

  goertzel.refresh();

  var buffer = b; // array of int samples
  buffer.forEach(function(sample) {
    goertzel.processSample(sample);
    
  });

  markFreq  = goertzel.energies[mark.toString()]
  spaceFreq = goertzel.energies[space.toString()]
  console.log(markFreq);
  console.log(spaceFreq);
  if (markFreq > spaceFreq) {
    console.log("MARK ==");
    // is mark
  } else if (spaceFreq > markFreq) {
    console.log("SPACE +++++++");
    // is space
  } else {
    // nothing??
  }

/*
  const note = ft.nearestNote(hz)

  // ignore frequencies too far from given octaves
  if (note.percentage > 100 || note.percentage < -100) return

  silence = 0
*/

})


mic.start()

