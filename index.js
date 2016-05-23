var s11 = require('sharp11');
var _ = require('underscore');
var WAAClock = require('waaclock');
var base64 = require('base64-arraybuffer');
var async = require('async');

var pianoSoundfont;
if (new Audio().canPlayType('audio/ogg') !== '') {
  pianoSoundfont = require('../soundfonts/acoustic_grand_piano-ogg');
}
else {
  pianoSoundfont = require('../soundfonts/acoustic_grand_piano-mp3');
}

var defaultDuration = 0.3;
var defaultOctave = 4;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var ctx = new AudioContext();
var clock = new WAAClock(ctx);
clock.start();

module.exports.init = function (func) {
  var buffers = {};

  var loadBuffer = function (note, callback) {
    ctx.decodeAudioData(base64.decode(pianoSoundfont[note]), function(buffer) {
      buffers[note] = buffer;
      callback();
    }, function(err) {
      callback(err);
    });
  };

  var ensureOctave = function (obj) {
    return obj.octave ? obj : obj.inOctave(defaultOctave);
  };

  async.each(_.keys(pianoSoundfont), loadBuffer, function (err) {
    var sources = [];
    var events = [];

    var getBuffer = function (note) {
      return buffers[note.clean().withAccidental('b').fullName];
    };

    var playNote = function (note, start, duration, callback) {
      var src = ctx.createBufferSource();
      var gainNode = ctx.createGain();

      src.buffer = getBuffer(note);
      src.connect(ctx.destination);
      src.start(start, 0, duration);
      sources.push(src);

      if (callback) {
        events.push(clock.callbackAtTime(_.partial(callback, note), start));
      }
    };

    var play = function (obj, start, duration, callback) {
      var notes;

      start = ctx.currentTime + (start || 0);
      duration = duration || defaultDuration;

      if (callback) callback = _.partial(callback, obj);

      // For a chord, play every note at once
      if (s11.chord.isChord(obj)) {
        notes = ensureOctave(obj).chord;
        _.each(notes, function (note) {
          playNote(note, start, duration, callback);
        });
      }
      // For a scale, play notes in succession
      else if (s11.scale.isScale(obj)) {
        notes = ensureOctave(obj).scale.concat(obj.root.transpose('P8'));
        _.each(notes, function (note, i) {
          playNote(note, start + i * duration, duration, callback);
        });
      }
      // For an array of notes, play notes at once
      else if (obj instanceof Array) {
        notes = _.map(obj, ensureOctave);
        _.each(notes, function (note) {
          playNote(note, start, duration, callback);
        });
      }
      // Otherwise, assume we have a note and play it
      else {
        playNote(s11.note.create(obj), start, duration, callback);
      }
    };

    var stop = function () {
      _.invoke(sources, 'stop');
      _.invoke(events, 'clear');
      sources = events = [];
    };

    var fns = {
      play: play,
      stop: stop
    };

    func(err, fns);
  });
};