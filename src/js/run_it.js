
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


// Validate options
function validateOptions(options) {
	let validation = {};

	// TODO: validate all the options!

	return validation;
}

// Run the thing
// This will fire when the submit button is clicked
function runTheProgram() {
	let options = getOptions(),
		validation = validateOptions(options);
	console.log(options, validation);
	alert(JSON.stringify(options));
}
