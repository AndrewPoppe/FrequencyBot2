// function to take scale name and look it up in custom scales
function getCustomScale(name) {
	return customScales[name];
}

// function to take scale name and return object with type and semitones
function getScale(name) {
	let result = {},
		scale = Tonal.scale(name) || getCustomScale(name);
	if (scale !== undefined) {
		semitones = scale.map(Tonal.Interval.semitones);
		result.type = name;
		result.semitones = semitones;
	}
	return result;
}

// save function
function saveCustomScale(e) {
	let	semitones = $('#DefineScaleInput').val(),
		name = $('#NameScaleInput').val();
	if(name === "") {
		$('#alertModal').modal('show');
	} else {

		// TODO: validate semitones - create modal for invalid semitones
		
		console.log(name, semitones);
		$('#ScaleSaveConfirmation').show('fade', 750, function() {$(this).hide('fade', 750)})
		//$('#ScaleSaveFailure').show('fade', 750, function() {$(this).hide('fade', 750)})
	}
}
$('#DefineScaleSaveButton').on('click', saveCustomScale)


