function startMidi(pads) {
	var info = document.getElementById("pressed");
	function midiErfolg(midiAccess) {
		var inputs = midiAccess.inputs.values();
		for (var ein = inputs.next(); ein && !ein.done; ein = inputs.next()) {
			ein.value.onmidimessage = midiNachr;
		}
		var outputs = midiAccess.outputs.values();
		for (var aus = outputs.next(); aus && !aus.done; aus = outputs.next()) {
			if (aus.value.name == "USB2.0-MIDI") {
				ausgabe = aus;
			}
		}
	}

	function midiFehler(e) {
		alert("Midi-Fehler");
	}

	var ausg = "";

	function midiNachr(nachr) {
		var data = nachr.data;
		var cmd = data[0] >> 4;
		var channel = data[0] & 0xf;
		var type = data[0] & 0xf0;
		var note = data[1];//c ist 60
		//Mod: A:9,Ais:10,H:11,C:0,Cis:1,D:2,Dis:3,E:4,F:5,Fis:6,G:7,Gis:8
		var velocity = data[2];
		
		switch(cmd) {
			case 9: //Note on
				if (velocity > 0) {
					ausg+=midiToNote(note) + " an (" + velocity + ")<br>";
					/*var panNum = note-36;
					var zeile = (panNum/8) | 0;
					var spalte = panNum%8;
					pads.cellOn(spalte, zeile);*/
					pads.midi(note, velocity);
					//ausgabe.value.send([0B10010001, note+4, velocity]);
					//ausgabe.value.send([0B10010001, note+7, velocity]);
					//ausg += note + " an (" + velocity + ") - Cmd: " + cmd + "<br>";
					break;
				}
			case 8: //Note off
				ausg+=midiToNote(note) + " aus<br>";
				/*var panNum = note-36;
				var zeile = (panNum/8) | 0;
				var spalte = panNum%8;
				pads.cellOff(spalte, zeile);*/
				pads.midi(note, 0);
				//ausgabe.value.send([0B10010001, note+4, 0]);
				//ausgabe.value.send([0B10010001, note+7, 0]);
				//ausg += note + " aus - Cmd: " + cmd + "<br>";
				break;
			
		}
		/*if (ausg.length > 200) {
			ausg = ausg.substring(ausg.length-199);
		}
		info.innerHTML=ausg;*/
	}

	function midiToNote(midiNum) {
		switch(midiNum%12) {
			case 0:
				return "c";
				break;
			case 1:
				return "cis";
				break;
			case 2:
				return "d";
				break;
			case 3:
				return "dis";
				break;
			case 4:
				return "e";
				break;
			case 5:
				return "f";
				break;
			case 6:
				return "fis";
				break;
			case 7:
				return "g";
				break;
			case 8:
				return "gis";
				break;
			case 9:
				return "a";
				break;
			case 10:
				return "ais";
				break;
			case 11:
				return "h";
				break;
		}
	}
	
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess({sysex: false}).then(midiErfolg, midiFehler);
	} else {
		alert("No MIDI-Support");
	}
	
}