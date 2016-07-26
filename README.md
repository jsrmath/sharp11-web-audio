# sharp11-web-audio
A Sharp11 plugin for playing notes, scales, and chords with Web Audio.

## Introduction
This module is designed for use with the [Sharp11](https://github.com/jsrmath/sharp11) library.  It comes with a piano soundfont and a simple loader that exposes functions for playing notes, scales, and chords from Sharp11.

## Install
`npm install sharp11-web-audio`

## Usage
```js
var s11 = require('sharp11');
var audio = require('sharp11-web-audio');

audio.init(function (err, fns) {
	// Your code here
});
```

## `fns.play(obj, start, duration, callback)`
* `obj` must be a [note](https://github.com/jsrmath/sharp11/blob/master/docs/note.md), [scale](https://github.com/jsrmath/sharp11/blob/master/docs/scale.md), [chord](https://github.com/jsrmath/sharp11/blob/master/docs/chord.md), or array of [notes](https://github.com/jsrmath/sharp11/blob/master/docs/note.md).
* `start` specifies how many seconds after invocation the object should be played.  It is `0` by default.
* `duration` specifies how many seconds the object should be sustained for.  It is `0.3` by default.
* If a `callback` is given, it will be invoked each time a note in the object is played.  It is given two parameters, the original object and the particular note being played.

Chords and arrays of notes are played all at once.  Scales are played in succession, with the `duration` applying to each note individually.

## `fns.arpeggiate(obj, start, duration, callback)`
* `obj` must be a [scale](https://github.com/jsrmath/sharp11/blob/master/docs/scale.md), [chord](https://github.com/jsrmath/sharp11/blob/master/docs/chord.md), or array of [notes](https://github.com/jsrmath/sharp11/blob/master/docs/note.md).
* `start` specifies how many seconds after invocation the object should be played.  It is `0` by default.
* `duration` specifies how many seconds each note should be sustained for.  It is `0.3` by default.
* If a `callback` is given, it will be invoked each time a note in the object is played.  It is given two parameters, the original object and the particular note being played.

Scales, chords and arrays of notes are played in succession, with the `duration` applying to each note individually.

## `fns.stop()`
Stops all objects scheduled to be played in the future and their callbacks.
