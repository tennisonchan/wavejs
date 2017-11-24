# Wave
A jQuery for web audio. This is just a proof of concept.

## Goal
- To make Web Audio API easier to work with. Less code but do more.
- To make Web Audio API more "functional" like

## Aspects
### Input-Effect-Output
- [x] [Create AudioNode](https://github.com/tennisonchan/wave#create-audioNode)
- [x] [Connect from source to destination](https://github.com/tennisonchan/wave#connect-from-source-to-destination)
- [ ] [Listen on events](https://github.com/tennisonchan/wave#listen-on-events)

### Channel & Stereo
- [ ] [Splitter & Merger](https://github.com/tennisonchan/wave#splitter-&-merger)
- [ ] [Convert to Mono](https://github.com/tennisonchan/wave#convert-to-mono)

### Stream & Record
- [ ] [Get user media](https://github.com/tennisonchan/wave#get-user-media)
- [ ] [Media recoder](https://github.com/tennisonchan/wave#media-recoder)
- [ ] [Get stream to video element](https://github.com/tennisonchan/wave#get-stream-to-video-element)

### Visual
### Schedule
### Note & Pitch

### Create AudioNode
To create an `OscillatorNode` with an id `osc`.
```js
var o1 = wave('oscillator#osc', {
  frequency: 750
  detune: 10,
  type: 'sine'
});

var o2 = wave('#osc'); // only after created o1
var o3 = wave(audioContext.createOscillator());

// get the same oscillator later
o1 === o2 // true
o1 === o3 // true
```

### Connect from source to destination
Connecting source with other AudioNode to destination.
```js
wave('source#s', { buffer }, audioContext)
.conenct('oscillator#main', { f: 750 })
.conenct('gain#g', { gain: 10 })
.conenct('filter#f', { type: 'lowshelf', f: 1000 })
.conenct('analyser#a')
.start('#main', currentTime + 1)
.destination();
```

### Listen on events
Adding handler for event `onended` on the oscillator.
```js
wave('oscillator#osc')
.on('ended', (e) => console.log(e));
```

### Splitter and Merger
```js
// in draft
wave('bufferSource#bs', { buffer }, audioContext)
.conenct('splitter#s', 2)
.conenct('gain#g', { gain: 0.5 }, '#s1')
.
.conenct('oscillator#o', { f: 750 })
.destination();

destination()
.conenct('merger')
.conenct('splitter')
```

### Convert to Mono
```js
// in draft
wave('source#s', { buffer }).mono()
```

### Get User Media
```js
let constraints = { audio: true };
let stream = wave.getUserMedia(constraints);

wave('mediaStreamSource#mss', stream)
.destination();
```

### Media recoder
```js
wave.record(stream)
.on('dataavailable', () => {})
.on('stop', () => {})
.start(0)
```

### Get stream to video element
```js
let constraints = { audio: true };

wave('video', { srcObject: wave.getUserMedia(constraints) })
.on('loadedmetadata', function(e) {
  this.play();
})
```
