// function to take scale name and look it up in custom scales
function getCustomScale(name) {
	return customScales[name];
}

// function to take scale name and return object with type and semitones
function getScale(name) {
	let result,
		scale = Tonal.scale(name) || getCustomScale(name);
	if (scale && !scale.type) {
		semitones = scale.map(Tonal.Interval.semitones);
		result = { 
			type: name,
			semitones: semitones
		};
	} else if (scale && scale.type) {
		result = scale;
	}
	return result;
}

// function to validate and parse custom scale
// expected input is a string with comma-separated integers, 
//   between 0 and 12 inclusive.
function parseSemitones(semitones) {
	let result = semitones.split(',').map(Number);
	function thisTest(num) {
		return Number.isInteger(num) && num >= 0 && num <= 12;
	}
	if (!result.every(thisTest)) result = undefined;
	return result;
}


// function to add scale to #ScaleTypeSelect select element
// sorts that select element after adding it
function addCustomScale(name, selected) {
	let wholename = name + " (Custom)",
		optionText = `<option value="${name}"${selected}>${wholename}</option>`;
	$('#ScaleTypeSelect').append(optionText);
	let my_options = $("#ScaleTypeSelect option");
	my_options.sort(function(a,b) {
	    if (a.text > b.text) return 1;
	    else if (a.text < b.text) return -1;
	    else return 0;
	});
	$("#ScaleTypeSelect").empty().append(my_options);
}


// TODO: Refactor this ugliness...
// save function 
function saveCustomScale(e) {
	let	semitones = $('#DefineScaleInput').val(),
		name = $('#NameScaleInput').val(),
		semitonesParsed = parseSemitones(semitones);
	if(name === "") {
		showModalWarn("You must provide a name for this custom scale!");
	} else if (semitonesParsed === undefined || semitonesParsed.length === 0) {
		showModalWarn(`The scale you provided was not valid. 
			Please follow the instuctions in the tooltip.`);
	} else if (Tonal.Scale.exists(name)) {
		showModalWarn(`You cannot save a custom scale with the same name as a
			built-in scale.`);
	} else {
		addCustomScale(name, " selected");
		chrome.storage.local.get("customScales", result => {
			if (result === undefined || result.customScales === undefined) {
				result = {};
			} else {
				result = result.customScales;
			}
			result[name] = {type: name, semitones: semitonesParsed};
			chrome.storage.local.set({customScales: result}, res => {
				if (chrome.runtime.lastError) {
					$('#ScaleSaveFailure').show('fade', 750, function() {
						$(this).hide('fade', 750)
					});
				} else {
					customScales = result;
					$('#ScaleSaveConfirmation').show('fade', 750, function() {
						$(this).hide('fade', 750)
					});
				}
			});
		});
	}
}
$('#DefineScaleSaveButton').on('click', saveCustomScale);


//-----------------------------------------------------------------------------
// DELETE CUSTOM SCALE
//-----------------------------------------------------------------------------

function deleteCustomScale(name) {
	// remove from custom scales storage, then remove list item
	chrome.storage.local.get("customScales", result => {
		$(`#ScaleTypeSelect option[value="${name}"]`).remove();
	});
}



