
$('#AppTitle').text(`FrequencyBot  v${chrome.runtime.getManifest().version}`)

// Create random number generator
const random = new Random();


// function for getting chrome storage item that returns a promise for chaining
function getData(Key) {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(Key, function(items) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				reject(chrome.runtime.lastError.message);
			} else {
				resolve(items[Key]);
			}
		});
	});
}

// custom scales global :(
let customScales = {};
getData('customScales').then(result => {
	if (result !== undefined) customScales = result;
});


// Get last used scale to set that as default. Then add in all scale options to
// scale type selector
chrome.storage.local.get(['lastScaleType', 'customScales'], res => {
	let last = res.lastScaleType,
		custom = res.customScales,
		scaleNames = Tonal.Scale.names();
	if (last === undefined) last = getScale("major");
	scaleNames.push('minor');
	scaleNames.filter(function(value, index, self) { 
    		return self.indexOf(value) === index;
	}).sort().map(name => {
		let selected = "";
	    $('#ScaleTypeSelect').append(`<option value="${name}">${name}</option>`);
	});
	for (let cname in custom) {
		let cselected = "";
		if (cname === last.type) cselected = " selected";
		addCustomScale(cname, cselected);
	}
	$("#ScaleTypeSelect option[value='"+last.type+"']").prop("selected", true);
	$('#DefineScaleInput').val(last.semitones.toString());
})

// Callback for when a scale is selected in scale type selector
$('#ScaleTypeSelect').on('change', e => {
	let newScaleName = e.target.value,
		newScale = getScale(newScaleName);
	chrome.storage.local.set({selectedScaleType: newScale}, res => {
		$('#DefineScaleInput').val(newScale.semitones.toString());
	});
});


// attach callback for main start button
$('#SubmitButton').on('click', runTheProgram);

// enable tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

$('#options-dialog').dialog({
	autoOpen: false,
	dialogClass: "no-close",
	modal: true,
	buttons: [
		{
			text: "Close",
			click: function() {
				$( this ).dialog( "close" );
			}
	    }
  	]
})
$('#options-button').click(() => $('#options-dialog').dialog('open'));
makeDraggable();