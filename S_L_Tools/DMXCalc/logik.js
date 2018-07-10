var dec = null;
var bin = null;
var sel = null;
var list = null;

function DecBin() {
	if (dec != null && bin != null) {
		var decVal = parseInt(dec.value, 10);
		if (decVal >= 0 && decVal <= 255) {
			var binTxt = decVal.toString(2);
			for (var i = binTxt.length-1; i < 7; i++) {
				binTxt = "0"+binTxt;
			}
			bin.value = binTxt;
		} else {
			dec.value = "1";
			bin.value = "00000001";
		}
	}
}

function BinDec() {
	if (dec != null && bin != null) {
		dec.value = parseInt(bin.value, 2).toString(10);
	}
}

function laden() {
	dec = document.getElementById("dec");
	bin = document.getElementById("bin");
	sel = document.getElementById("DMX");
	list = document.getElementById("Channels");
	DecBin();
	setChannels();
	RefreshChannels();
}

var kanaele = new Map();

function setChannels() {
	kanaele.set("LEDs", ["(Leer)", "(Leer)", "Rot", "Gr&uuml;n", "Blau"]);
	kanaele.set("LEDl", ["Rot", "Gr&uuml;n", "Blau"]);
	kanaele.set("MH", ["Pan (0&deg; bis 540&deg;)", "Tilt (0&deg; bis 270&deg;)", "Pan fine", "Tilt fine", "P/T speed (normal bis langsam)", "Color (0-6: Wei&szlig;; 7-13: Gelb; 14-20: Pink; 21-27: Gr&uuml;n; 28-34: Peachblow; 35-41: Blau; 42-48: Kelly-Gr&uuml;n; 49-55: Rot; 56-63: Dunkelblau; 64-127: Halbfarben; 128-191: Regenbogen pos.-Geschw. ansteigend; 192-255: Regenbogen neg.-Gechw. ansteigend)", "Shutter (0-3: Zu; 4-7/210-255: Offen; 8-215: Strobe-Geschw. ansteigend)", "Dimmer", "Gobo (0-63: Gobo 1-8; 64-119: Gobo 7-1 shake-je Geschw. ansteigend; 120-127: Offen; 128-191: Wheel-rot pos.-Geschw. ansteigend; 192-255: Wheel-rot neg.-Geschw. ansteigend)", "Gobo-Rot (0-63: Still; 64-147: Pos.-Geschw. ansteigend; 148-231: Neg.-Geschw. asteigend; 232-255: Springend", "Special Functions (0-7/56-87/160-255: Nichts)", "Programme (0-7: Nichts; 8-135: Programme 1-8; 136-255: Sound2Light 1-8)", "Prisma (0-7: Nichts; 8-247: Rot.-Geschw. ansteigend; 248-255: Still)", "Focus"]);
	kanaele.set("Nebel", ["Intensit&auml;t", "Intervall", "Dauer"]);
	kanaele.set("Kugel", ["Dimmer", "Dimmer Rot &amp; Gelb", "Dimmer Gr&uuml;n &amp; Violett", "Dimmer Blau &amp; Wei&szlig;", "Strobe (0-9: Still; 10-255: Geschw. ansteigend)", "Drehposition/-geschwindikeit (0-5: Still; 6-139: Position; 140-255: Geschw. ansteigend)", "Programmeffekte (0-9: Kein Efekt; 10-72: Farbfade; 73-134: Farbwechsel; 135-197: RGB-Wechsel; 198-220: Sound2Light 1; 221-225: Sound2Light 2)"]);
	kanaele.set("Dimmer", ["Dimmer"]);
}

function RefreshChannels() {
	if (sel != null && list != null) {
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		
		var belegung = kanaele.get(sel.value);
		for (var i = 0; i < belegung.length; i++) {
			var eintrag = document.createElement("li");
			eintrag.innerHTML = belegung[i];
			list.appendChild(eintrag);
		}
	}
}