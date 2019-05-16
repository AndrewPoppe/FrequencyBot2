

// function to take scale name and return object with type and semitones
function getScale(name) {
	let result = {},
		scale = Tonal.scale(name);
	if (scale === undefined) {
		//TODO
	} else {
		semitones = scale.map(Tonal.Interval.semitones);
		result.type = name;
		result.semitones = semitones;
	}
	return result;
}

// Get last used scale to set that as default. Then add in all scale options to
// scale type selector
chrome.storage.local.get('lastScaleType', res => {
	if (res.type === undefined) res = getScale("major");
	Tonal.Scale.names().map(name => {
		let selected = "";
		if (name === res.type) selected = " selected";
	    $('#ScaleTypeSelect').append('<option value="'+name+'"'+selected+'>'+name+'</option>');
	});
	$('#DefineScaleInput').val(res.semitones.toString());
})

// Callback for when a scale is selected in scale type selector
$('#ScaleTypeSelect').on('change', e => {
	let newScaleName = e.target.value,
		newScale = getScale(newScaleName);
	chrome.storage.local.set({selectedScaleType: newScale}, res => {
		$('#DefineScaleInput').val(newScale.semitones.toString());
	});
});




let allFiles = {};
let unmatchedFiles = {raw: [], ren: []};
let MaxRam;


$('#file-upload').on("change", getFileList);
$('#upload-button').click(() => $('#file-upload').click());
$('#ram-chooser').spinner();
chrome.storage.local.get('MaxRam', res => {
	MaxRam = res.MaxRam;
	if(!MaxRam) {
		MaxRam = 1024;
		chrome.storage.local.set({MaxRam: MaxRam});
	}
	$('#ram-chooser').spinner("value", MaxRam);
});
$('#options-dialog').dialog({
	autoOpen: false,
	dialogClass: "no-close",
	modal: true,
	buttons: [
		{
			text: "Save",
			click: function() {
				MaxRam = $('#ram-chooser').spinner("value");
				chrome.storage.local.set({MaxRam: MaxRam}, () => { console.log("Set maximum ram to " + MaxRam)});
				$( this ).dialog( "close" );
			}
		},
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