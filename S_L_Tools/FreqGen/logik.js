var ton = null;
var oszi = null;
var txtFreq = null;
var typeSel = null;

function laden() {
	ton = new (window.AudioContext || window.webkitAudioContext)();
	txtFreq = document.getElementById("frequenz");
	typeSel = document.getElementById("wave");
}

function toggleOsc(obj) {
	if (ton != null && txtFreq != null && typeSel != null) {
		if (obj.name == "Start") {
			oszi = ton.createOscillator();
			oszi.type = typeSel.value;
			oszi.connect(ton.destination);
			if (oszi != null) {				
				var freq = parseInt(txtFreq.value);
				if (!isNaN(freq)) {
					oszi.frequency.setValueAtTime(freq, ton.currentTime);
					oszi.start();
				}
				obj.name = "Stop";
				obj.innerText = "Stop";
			}
		} else {
			if (oszi != null) {
				oszi.stop();
				obj.name = "Start";
				obj.innerText = "Start";
			}
		}
	}
}

function stopOszi() {
	if (ton != null && oszi != null) {
		oszi.stop();
		var obj = document.getElementById("toggle");
		obj.name = "Start";
		obj.innerText = "Start";
	}
}

function setWave() {
	if (ton != null && typeSel != null) {
		oszi.type = typeSel.value;
	}
}

function setFreq() {
	if (ton != null && txtFreq != null) {
		var freq = parseInt(txtFreq.value);
		if (!isNaN(freq)) {
			oszi.frequency.setValueAtTime(freq, ton.currentTime);
		}
	}
}