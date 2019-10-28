#!/usr/bin/env node

const { FrequencyTable, createMic, bufferToFreq } = require('my-tuner');
const Goertzel = require('goertzeljs');
const Mic = require('mic');

const ft = new FrequencyTable(3, 5);

const rate = 41000;

const mark = 4400;
const space = 5000;

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


let count = 0;
stream.on('data', b => {
  const hz = bufferToFreq(rate, b);
  console.log(hz);

  goertzel.refresh();

  const wf = new Int16Array(b.buffer, b.byteOffset, b.byteLength / Int16Array.BYTES_PER_ELEMENT);

  wf.forEach(function(sample) {
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

