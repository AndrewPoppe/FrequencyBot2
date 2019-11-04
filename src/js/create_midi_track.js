

// Create the track
// inputs:
//	options {object} - options object resulting from getOptions function
// returns:
//	?
function createTrack(options) {
	let track = new MIDIWriter.Track()

	// set BPM of track
	track.setTempo(options.track.bpm);

	// get array of note event objects
	let notes = getNoteEvents(options);

	// add events to track
	notes.forEach(note => {
		track.addEvent(note);
	});

	let writer = new MIDIWriter.Writer(track);
	let blob = new Blob([writer.buildFile()], {type: "audio/midi"});
	let filename = `FrequencyBot_${options.scale.type.replace(" ", "_")}_` + 
				   `${options.scale.key}${options.scale.baseOctave}_` +
				   `${options.track.bpm}BPM` +
				   `.mid`;
	
	console.log(notes);
	saveAs(blob, filename);
}

// take options and create array of note events
function getNoteEvents(options) {
	let noteEvents = [],
		constraints = getConstraints(options);	

	let lastPitch,
		nRepeats = 0,
		beats = 0,
		result;

	while (beats <= constraints.beatsTotal) {
		result = getNoteEvent(constraints, options);
		if (result.pitch[0] == lastPitch) nRepeats++
		while (nRepeats >= constraints.note.maxRepeats) {
			result = getNoteEvent(constraints, options);
			if (result.pitch[0] !== lastPitch) nRepeats = 0;
		}
		noteEvents.push(result);
		beats += result.duration.length + result.wait.length;
		lastPitch = result.pitch[0];
		constraints.direction = constraints.lastPitch - lastPitch > 0 ? "decreasing" : "increasing";
		constraints.lastPitch = lastPitch;
	}

	return noteEvents;
}

// returns an object with note event constraints
function getConstraints(options) {
	let constraints = {},
		bpm = Number(options.track.bpm),
		seconds = Number(options.track.duration);
	constraints.beatsTotal = Math.round(bpm/60 * seconds);
	// PITCH //
	let center = Tonal.Note.midi(options.scale.key + options.scale.baseOctave),
		semitonesOrig = options.scale.semitones.map(s => {return s + center}),
		semitones = Array.from(semitonesOrig),
		octavesAbove = Number(options.scale.octavesAbove),
		octavesBelow = Number(options.scale.octavesBelow);
	let Oa = Ob = 0;
	while (Oa < octavesAbove) {
		Oa++
		semitones = semitones.concat(semitonesOrig.map(s => {return(s + Oa*12)}));
	}
	while (Ob < octavesBelow) {
		Ob++
		semitones = semitones.concat(semitonesOrig.map(s => {return(s - Ob*12)}));
	}
	semitones = semitones.sort();
	let centerIndex = semitones.indexOf(center),
		pitchMin = Math.max(semitones[0], 0),
		pitchMax = Math.min(semitones[semitones.length-1], 127);
	constraints.pitch = {
		center: centerIndex,
		min: 0,
		max: semitones.length - 1,
		semitones: semitones
	};

	// For Guassian pitch distribution
	if (options.scale.randomType === "normal") {
		let res = getMSD(constraints.pitch.min, constraints.pitch.max, constraints.pitch.center);
		constraints.pitch.mean = res.Mean;
		constraints.pitch.SD = res.SD;
	}

	// NOTE DURATION //
	constraints.note = {
		min: Number(options.note.duration.min),
		max: Number(options.note.duration.max),
		maxRepeats: Number(options.note.maxRepeats)
	};
	if (options.note.randomType === "normal") {
		let res = getMSD(constraints.note.min, constraints.note.max);
		constraints.note.mean = res.Mean;
		constraints.note.SD = res.SD;
	}

	// REST DURATION //
	constraints.rest = {
		min: Number(options.rest.duration.min),
		max: Number(options.rest.duration.max)
	};
	if (options.rest.randomType === "normal") {
		let res = getMSD(constraints.rest.min, constraints.rest.max);
		constraints.rest.mean = res.Mean;
		constraints.rest.SD = res.SD;
	}

	return constraints;
}

// randomly select a value given parameters
function select(min, max, randomMethod, a, c) {
	let value;
	if (!a) a = min;
	if (!c) c = max;
	while (value === undefined || value < min || value > max) {
		value = Math.round(random[randomMethod](a, c));
	}
	return value;
}

// randomly select pitch from given array of pitches
function selectPitch(constraints, options) {
	let arr = constraints.pitch.semitones;
	if (options.randomMethod === "walking") {
		let lp = constraints.lastPitch;
		if (constraints.direction === "decreasing") {
			let a = lp - 1,
				b = lp + 1
		} else {
			let a = lp + 1,
				b = lp - 1
		}
		let choices = Array(65).fill(a).concat(Array(35).fill(b)),
			index = Math.floor(Math.random() * choices.length);
	} else {
		let index = Math.floor(select(0, arr.length, 
									  options.randomMethod, 
									  constraints.pitch.mean, 
									  constraints.pitch.sd));
	}
	if (index == arr.length) index--;
	if (index < 0) index = 0;
	return arr[index];
}

// returns a single note event
function getNoteEvent(constraints, options) {
	let pitch = selectPitch(constraints, options),
		noteDurVal = select(constraints.note.min,
					        constraints.note.max,
					        options.note.randomType,
					        constraints.note.mean,
					        constraints.note.SD),
		noteDur = Array(noteDurVal).fill("4"),
		restDurVal = select(constraints.rest.min,
					        constraints.rest.max,
					        options.rest.randomType,
					        constraints.rest.mean,
					        constraints.rest.SD),
		restDur = Array(restDurVal).fill("4"),
		noteEvent = new MIDIWriter.NoteEvent({
			pitch: pitch,
			duration: noteDur,
			wait: restDur
		});
	return noteEvent;
}


// get mean and SD for random.normal function given min, max, and center values
// min: min value
// max: max value
// center: center of distribution (optional, only if it should not be symmetric)
function getMSD(min, max, center = round((max-min)/2)) {
	let SD = Math.max(max-center, center-min)/3;
	return {
				Mean: center,
				SD: SD
			}
}