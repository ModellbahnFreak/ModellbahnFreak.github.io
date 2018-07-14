var selectedPreset = 2;
var localAvailable = false;
var openedItem = "";
var submenu;
var selectedMode = 0;
var URL = window.URL || window.webkitURL;

function Pad(table, col, row) {
	var that = this;
	this.spalten = col;
	this.zeilen = row
	this.tabelle = document.getElementById(table);
	this.tabelle.innerHTML = "";
	for (var y = 0; y < row; y++) {
		var zeile = this.tabelle.insertRow(0);
		for (var x = 0; x < col; x++) {
			var zelle = zeile.insertCell(0);
			zelle.innerHTML = "";
			zelle.addEventListener("mousedown", function(e) {
				that.cellOn2(this, 1);
			});
			zelle.addEventListener("mouseup", function(e) {
				that.cellOff2(this, 1);
			});
			var ton = document.createElement("audio");
			ton.onended = function() {
				that.cellOffFocre(this.parentNode);
			};
			zelle.appendChild(ton);
		}
	}
	this.MidiLayout = new Array();
	this.playMode = 0; //0:toggle, 1:button
}

Pad.prototype.showFileSelect = function(anAus) {
	for (var y = 0; y < this.zeilen; y++) {
			var zeile = this.tabelle.rows[y];
			for (var x = 0; x < this.spalten; x++) {
				var zelle = zeile.cells[x];
				var fileSel = zelle.getElementsByTagName("input")[0];
				while (fileSel) {
					zelle.removeChild(fileSel);
					fileSel = zelle.getElementsByTagName("input")[0];
				}
			}
	}
	if (anAus) {
		for (var y = 0; y < this.zeilen; y++) {
			var zeile = this.tabelle.rows[y];
			for (var x = 0; x < this.spalten; x++) {
				var zelle = zeile.cells[x];
				var fileSel = document.createElement("input");
				fileSel.type = "file";
				fileSel.accept = "audio/*";
				//fileSel.onclick = stopClickEvent;
				fileSel.onchange = function() {
					var datei = this.files[0];
					if (datei) {
						var ton = this.parentNode.getElementsByTagName("audio")[0];
						if (ton.canPlayType(datei.type) === "") {
							alert("Diese Datei kann nicht wiedergegeben werden!");
						} else {
							var dateiURL = URL.createObjectURL(datei);
							ton.src = dateiURL;
						}
					}
				};
				zelle.appendChild(fileSel);
			}
		}
	}
}

Pad.prototype.setLaunchpad = function() {
	this.MidiLayout = new Array();
	for (var i = 11; i <= 89; i++) {
		var col = ((i%10)-1), row = (8-((i/10) | 0));
		if (col >= 0 && row >= 0) {
			this.MidiLayout[i] = {x: col, y: row};
		}
	}
}

Pad.prototype.setKeyboard = function() {
	this.MidiLayout = new Array();
	for (var i = 28; i <= 100; i++) {
		var col = ((i-28)%9), row = (((i-28)/9) | 0);
		if (col >= 0 && row >= 0) {
			this.MidiLayout[i] = {x: col, y: row};
		}
	}
}

Pad.prototype.midi = function(note, velocity) {
	try {
		if (velocity > 0) {
			this.cellOn(this.MidiLayout[note].x, this.MidiLayout[note].y, velocity/127);
		} else {
			this.cellOff(this.MidiLayout[note].x, this.MidiLayout[note].y);
		}
	} catch (err) {
		console.log("Not patched key!");
	}
}

Pad.prototype.cellOn = function(col, row, volume) {
	var zelle = this.tabelle.rows[row].cells[col];
	var ton = zelle.getElementsByTagName("audio")[0];
	if (ton.readyState == 4 && ton.paused) {
		zelle.style.backgroundColor = "#0000ff";
		if (volume > 0) {
			ton.currentTime = 0;
			ton.volume = volume;
			ton.play();
		}
	} else if (ton.readyState == 0) {
		zelle.style.backgroundColor = "#eeeeff";
	} else {
		if (this.playMode == 0) {
			ton.pause()
			zelle.style.backgroundColor = "";
		}
	}
};

Pad.prototype.cellOn2 = function(zelle, volume) {
	var ton = zelle.getElementsByTagName("audio")[0];
	if (ton.readyState == 4 && ton.paused) {
		zelle.style.backgroundColor = "#0000ff";
		if (volume > 0) {
			ton.currentTime = 0;
			ton.volume = volume;
			ton.play();
		}
	} else if (!ton.paused) {
		if (this.playMode == 0) {
			ton.pause()
			zelle.style.backgroundColor = "";
		}
	} else if (ton.readyState == 0) {
		zelle.style.backgroundColor = "#eeeeff";
	}
};

Pad.prototype.cellOff = function(col, row) {
	var zelle = this.tabelle.rows[row].cells[col];
	var ton = zelle.getElementsByTagName("audio")[0];
	if (this.playMode == 1) {
		zelle.style.backgroundColor = "";
		ton.pause();
	}
	if (ton.readyState == 0) {
		zelle.style.backgroundColor = "";
	}
};

Pad.prototype.cellOff2 = function(zelle) {
	var ton = zelle.getElementsByTagName("audio")[0];
	if (this.playMode == 1) {
		zelle.style.backgroundColor = "";
		ton.pause();
	}
	if (ton.readyState == 0) {
		zelle.style.backgroundColor = "";
	}
};

Pad.prototype.cellOffFocre = function(zelle) {
	zelle.style.backgroundColor = "";
	var ton = zelle.getElementsByTagName("audio")[0];
	if (!ton.paused) {
		ton.pause();
	}
};

function createMenuItem() {
	if (typeof(localAvailable) !== "undefined") {
		localAvailable = true;
		selectedPreset = parseInt(localStorage.getItem("Preset"));
		switch(selectedPreset) {
			case 1:
				pads.setLaunchpad();
				break;
			case 2:
				pads.setKeyboard();
				break;
			default:
				pads.setKeyboard();
				break;
		}
		var playMode = parseInt(localStorage.getItem("ToggleMode"));
		if (isNaN(playMode)) {
			pads.playMode = 0;
		} else {
			pads.playMode = playMode;
		}
	} else {
		pads.setKeyboard();
	}
	document.onclick = clickBack;
	var menu = document.getElementById("menu");
	submenu = document.getElementById("submenu");
	menu.appendChild(createMenuElement("Datei", "Datei"));
	//menu.appendChild(createMenuElement("Bearbeiten", "Bearbeiten"));
	menu.appendChild(createMenuElement("Play", "Play"));
	menu.appendChild(createMenuElement("Presets", "Presets"));
	menu.appendChild(createMenuElement("Mode", "Mode"));
	menu.appendChild(createMenuElement("Einstellungen", "Einstellungen"));
}

function createMenuElement(beschr, name) {
	var menuItem = document.createElement("div");
	menuItem.className = "menuItem";
	//var menuLink = document.createElement("a");
	menuItem.onclick = function(e) {
		clickMenu(this, e);
	};
	menuItem.innerHTML = beschr;
	menuItem.name = name;
	return menuItem;
}

function clickBack() {
	openedItem = "";
	//submenu.style.display = "none";
	submenu.style.opacity = 0;
}

function clickMenu(objekt, e) {
	submenu.style.left = objekt.offsetLeft+"px";
	switch(objekt.name) {
		case "Datei":
			openedItem = "Datei";
			addDateiSubmenu();
			break;
		case "Bearbeiten":
			openedItem = "Bearbeiten";
			addBearbSubmenu();
			break;
		case "Play":
			openedItem = "Play";
			addPlaySubmenu();
			break;
		case "Presets":
			openedItem = "Presets";
			addPresetSubmenu();
			break;
		case "Mode":
			openedItem = "Mode";
			addModeSubmenu();
			break;
		case "Einstellungen":
			openedItem = "Einstellungen";
			addEinstSubmenu();
			break;
	}
	submenu.style.opacity = 100;
	return stopClickEvent(e);
}

function addDateiSubmenu() {
	function clickSubmenu(objekt, e) {
		return stopClickEvent(e);
	}
	clearSubmenu();
	submenu.appendChild(createSubmenuElement("Neu", "Neu", clickSubmenu));	
	submenu.appendChild(createSubmenuElement("&Ouml;ffnen", "Oeffnen", clickSubmenu));
	submenu.appendChild(createSubmenuElement("Speichern", "Save", clickSubmenu));
	submenu.appendChild(createSubmenuElement("Speichern unter...", "SaveAs", clickSubmenu));
}

function addBearbSubmenu() {
	function clickSubmenu(objekt, e) {
		return stopClickEvent(e);
	}
	clearSubmenu();
	submenu.appendChild(createSubmenuElement("R&uuml;ckg&auml;ngig", "Rueck", clickSubmenu));	
	submenu.appendChild(createSubmenuElement("Wiederholen", "Wdh", clickSubmenu));
}

function addPlaySubmenu() {
	function clickSubmenu(objekt, e) {
		return stopClickEvent(e);
	}
	clearSubmenu();
}

function addPresetSubmenu() {
	function clickSubmenu(objekt, e) {
		if (objekt.name != "Save") {
			selectedPreset = setTickBox(objekt, 4, null);
			if (localAvailable) {
				localStorage.setItem("Preset", selectedPreset);
			}
			switch(selectedPreset) {
				case 1:
					pads.setLaunchpad();
					break;
				case 2:
					pads.setKeyboard();
					break;
			}
		}
		return stopClickEvent(e);
	}
	clearSubmenu();
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2610;</span> Leer", "Leer", clickSubmenu));	
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2610;</span> Launchpad", "Launchpad", clickSubmenu));
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2611;</span> Keyboard", "Keyboard", clickSubmenu));
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2612;</span> Custom", "Custom", clickSubmenu));
	submenu.appendChild(document.createElement("hr"));
	submenu.appendChild(createSubmenuElement("Save custom...", "Save", clickSubmenu));
	setTickBox(null, 4, selectedPreset);
}

function addModeSubmenu() {
	function clickSubmenu(objekt, e) {
		selectedMode = setTickBox(objekt, submenu.childNodes.length, null);
		switch (selectedMode) {
			case 0:
				pads.showFileSelect(false);
				break;
			case 1:
				pads.showFileSelect(true);
				break;
		}
		return stopClickEvent(e);
	}
	clearSubmenu();
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2611;</span> Play", "Play", clickSubmenu));	
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2610;</span> Set Sounds", "Sounds", clickSubmenu));
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2610;</span> Set Colors", "Colors", clickSubmenu));
	submenu.appendChild(createSubmenuElement("<span name='symbol'>&#x2610;</span> Set MIDI", "MIDI", clickSubmenu));
	setTickBox(null, 4, selectedMode);
}

function addEinstSubmenu() {
	function clickSubmenu(objekt, e) {
		switch(objekt.name) {
			case "Toggle":
				if (pads.playMode == 0) {
					objekt.innerHTML = "Button Mode";
					pads.playMode = 1;
				} else {
					objekt.innerHTML = "Toggle Mode";
					pads.playMode = 0;
				}
				localStorage.setItem("ToggleMode", pads.playMode);
				break;
			case "MidiIn":
				console.log(midiIO.getInputs());
				break;
		}
		return stopClickEvent(e);
	}
	clearSubmenu();
	submenu.appendChild(createSubmenuElement("MIDI-In-Ger&auml;t &#x25B6;", "MidiIn", clickSubmenu));	
	submenu.appendChild(createSubmenuElement("MIDI-Out-Ger&auml;t &#x25B6;", "MidiOut", clickSubmenu));
	var toggleBtn = createSubmenuElement("Toggle Mode", "Toggle", clickSubmenu);
	submenu.appendChild(toggleBtn);
	if (pads.playMode == 0) {
		toggleBtn.innerHTML = "Toggle Mode";
	} else {
		toggleBtn.innerHTML = "Button Mode";
	}
}

function setTickBox(objekt, len, setPos) {
	var subChilds = submenu.childNodes;
	var setNum = -1;
	if (setPos && setPos >= 0) {
		for (var i = 0; i < len; i++) {
			if (i != setPos) {
				subChilds[i].childNodes[0].innerHTML = "&#x2610;";
			} else {
				subChilds[i].childNodes[0].innerHTML = "&#x2611;";
				setNum = i;
			}
		}
	} else if (objekt) {
		for (var i = 0; i < len; i++) {
			if (subChilds[i].name != objekt.name) {
				subChilds[i].childNodes[0].innerHTML = "&#x2610;";
			} else {
				subChilds[i].childNodes[0].innerHTML = "&#x2611;";
				setNum = i;
			}
		}
	}
	return setNum;
}

function clearSubmenu() {
	while(submenu.firstChild) {
		submenu.removeChild(submenu.firstChild);
	}
}

function createSubmenuElement(beschr, name, clickEvent) {
	var submenuItem = document.createElement("div");
	submenuItem.className = "submenuItem";
	//var menuLink = document.createElement("a");
	submenuItem.onclick = function(e) {
		clickEvent(this, e);
	};
	submenuItem.innerHTML = beschr;
	submenuItem.name = name;
	return submenuItem;
}

function stopClickEvent(e) {
	var ereign = e ? e : window.event;
	if (ereign.stopPropagation) {
		ereign.stopPropagation();
	} else {
		ereign.cancelBubble = true;
	}
	return false;
}