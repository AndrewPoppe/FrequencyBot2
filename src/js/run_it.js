
//------------------------------------------------------------------------------
// Functions for setting up MIDI creation when user clicks start button
//------------------------------------------------------------------------------


// Collects all 
// returns:
//	object - all options necessary for creating MIDI file
function getOptions() {
	let options = {};

	////////////////////////////
	// SCALE
	// Scale
	let scaleName = $('#ScaleTypeSelect').val();
	options.scale = getScale(scaleName) || getCustomScale(scaleName) || {};

	// Key
	options.scale.key = $('#KeySelect').val();

	// Base Octave
	options.scale.baseOctave = $('#OctaveSelect').val();

	// Octaves Below
	options.scale.octavesBelow = $('#OctavesBelowSelect').val();

	// Octaves Above
	options.scale.octavesAbove = $('#OctavesAboveSelect').val();

	// Randomization Type - Note
	options.scale.randomType = $('#NoteRandomSelect').val();

	////////////////////////////
	// TRACK
	// Track Duration
	options.track = {};
	options.track.duration = $('#DurationInput').val();

	// Beats Per Minute
	options.track.bpm = $('#BPMInput').val();

	////////////////////////////
	// NOTE
	// Max Note Repeats
	options.note = {};
	options.note.maxRepeats = $('#MaxRepeatsInput').val();

	// Min Note Duration
	options.note.duration = {
		min: $('#MinNoteDurInput').val(),
		max: $('#MaxNoteDurInput').val()
	};
	
	// Randomization Type - Note Duration
	options.note.randomType = $('#NoteDurRandomSelect').val();

	////////////////////////////
	// REST
	// Rest Duration
	options.rest = {};
	options.rest.duration = {
		min: $('#MinRestDurInput').val(),
		max: $('#MaxRestDurInput').val()
	};
	
	// Randomization Type - Rest Duration
	options.rest.randomType = $('#RestDurRandomSelect').val();
 
	return options;
}


// validation function
// tests whether value is empty, then whether is number between MIN and MAX
function validate(x, MIN, MAX) {
	if (x === "") return false;
	let X = Number(x);
	if (isNaN(X)) return false;
	if (X > MAX || X < MIN) return false;
	return true;
}

// Validate options
function validateOptions(options) {
	let errors = [];
	// duration and bpm
	if (!validate(options.track.duration, 1, 5000)) errors.push("Track Duration");
	if (!validate(options.track.bpm, 1, 500)) errors.push("Track BPM");

	// note
	if (!validate(options.note.maxRepeats, 0, 5000)) errors.push("Note Max Repeats");
	if (!validate(options.note.duration.min, 1, Number(options.note.duration.max))) errors.push("Note Duration Min");
	if (!validate(options.note.duration.max, Number(options.note.duration.min), 5000)) errors.push("Note Duration Max");

	// rest
	if (!validate(options.rest.duration.min, 0, Number(options.rest.duration.max))) errors.push("Rest Duration Min");
	if (!validate(options.rest.duration.max, Number(options.rest.duration.min), 5000)) errors.push("Rest Duration Max");

	// Warn
	if (errors.length !== 0) {
		showModalWarn(`There were problems with the following inputs: ${JSON.stringify(errors)}`);
		return false;
	}

	return true;
}

// Run the thing
// This will fire when the submit button is clicked
function runTheProgram() {
	let options = getOptions(),
		validation = validateOptions(options);
	if (validation) {
		chrome.storage.local.set({lastScaleType: options.scale});
		console.log(options, validation);
	}
}
