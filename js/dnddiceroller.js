// Function to generate the HTML for a single dice roller line
function lineHTML() {
  const dForm = [
    '<button class="remove-line" onclick="removeLine(event)" title="remove this line">-</button><table class="d-line">',
    '<caption><input type="text" maxlength="22" class="label" onchange="saveLabel(event)"></input></caption><tr>',
    '<td><input class="d-count" type="number" value="1" min="1" max="99" onchange="diceControl(event)" onclick="diceControl()"></input></td>',
    '<td><select class="d-type" onchange="saveChange(event)"></select></td>',
    '<td><select class="pos-neg" onchange="saveChange(event)"><option value="0">+</option><option value="1">-</option></select></td>',
    '<td><input class="d-mod" type="number" value="0" min="0" max="99" onchange="diceControl(event)"></input></td>',
    '<td><select class="mod-target" onchange="saveChange(event)"><option value="0">to each</option><option value="1" selected>to total</option></select></td>',
    '</tr></table><div class="line-result"></div>',
    '<button class="roll" onclick="clickRoll(event)">Roll</button>'
  ];

  var dBuild = '';
  for (var i = 0; i < dForm.length; i++) {
    dBuild += dForm[i];
  }

  return dBuild;
}

// Function to populate the copyright text
function copyrightText() {
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var siteLink = 'DnDDiceRoller.com';
  var copyRight = 'Copyright \u00A9 ' + currentYear + ' ' + siteLink + '. All rights reserved.';
  document.getElementById('copy-text').appendChild(document.createTextNode(copyRight));
}

// Function to get the event object
function getEvent(event) {
  if (!event) event = event || window.event;
  return event;
}

// Function to get the index of an element among its siblings
function getElementIndex(node) {
  var index = 0;
  while ((node = node.previousElementSibling)) {
    index++;
  }
  return index;
}

// Function to get the index of a class within a collection
function getClassIndex(collection, node) {
  for (var i = 0; i < collection.length; i++) {
    if (collection[i] === node)
      return i;
  }
  return -1;
}

// Function to get the index of an ancestor element
function getAncestorIndex(element, target) {
  var parent = target.parentElement;

  while (parent.tagName != element) {
    parent = parent.parentElement;
    if (parent.tagName == 'BODY')
      return -1;
  }

  return getElementIndex(parent);
}

// Function to handle privacy confirmation
function privacyOK() {
  deleteElement(document.getElementById('privacy-div'));
}

// Function to clear the dice roll log
function clearLog() {
  document.getElementById('log-list').innerHTML = "";
}

// Function to handle sound checkbox change
function changeSound(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;

  if (document.getElementById('save-checkbox').checked) {
    localStorage.setItem('sound-checkbox', document.getElementById('sound-checkbox').checked);
  }
}

// Function to save the state of the 'save settings' checkbox
function saveCheckedState(e) {
  var e = window.event || e;
  var checkbox = e.target || e.srcElement;
  localStorage.setItem('save-checkbox', checkbox.checked);
  if (checkbox.checked) {
    saveAll();
  } else {
    localStorage.clear();
  }
}

// Function to load the saved state of checkboxes
function loadCheckedState() {
  let checked = JSON.parse(localStorage.getItem('save-checkbox'));
  let saveCheckBox = document.getElementById("save-checkbox");
  saveCheckBox.checked = checked;

  let soundCheckBox = document.getElementById("sound-checkbox");
  soundCheckBox.checked = JSON.parse(localStorage.getItem('sound-checkbox'));
}

// Function to save changes to local storage
function saveChange(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;

  var targetIndex = getAncestorIndex('LI', target);

  if (document.getElementById('save-checkbox').checked) {
    var targetClass = target.className;
    var targetStorageLabel = targetClass + targetIndex.toString();
    localStorage.setItem(targetStorageLabel, target.value);
  }
  var targetLabel = document.getElementsByClassName('label')[targetIndex];
  targetLabel.placeholder = labelPlaceholder(targetIndex);
}

// Function to save label changes to local storage
function saveLabel(e) {
  var e = window.event || e;
  if (document.getElementById('save-checkbox').checked) {
    var target = e.target || e.srcElement;
    var targetClass = target.className;
    var targetIndex = getAncestorIndex('LI', target);
    var targetStorageLabel = targetClass + targetIndex.toString();
    localStorage.setItem(targetStorageLabel, target.value);
  }
}

// Function to save a single line of dice settings
function saveLine(i) {
  localStorage.setItem('d-count' + i.toString(), document.getElementsByClassName('d-count')[i].value);
  localStorage.setItem('d-type' + i.toString(), document.getElementsByClassName('d-type')[i].value);
  localStorage.setItem('pos-neg' + i.toString(), document.getElementsByClassName('pos-neg')[i].value);
  localStorage.setItem('d-mod' + i.toString(), document.getElementsByClassName('d-mod')[i].value);
  localStorage.setItem('mod-target' + i.toString(), document.getElementsByClassName('mod-target')[i].value);
  localStorage.setItem('label' + i.toString(), document.getElementsByClassName('label')[i].value);
}

// Function to save all dice settings
function saveAll() {
  var count = ulCount();
  for (var i = 0; i < count; i++) {
    saveLine(i);
  }
  localStorage.setItem('line-count', count);
  localStorage.setItem('sound-checkbox', document.getElementById('sound-checkbox').checked);
}

// Function to load all saved dice settings
function loadAll() {
  var count = JSON.parse(localStorage.getItem('line-count'));
  for (var i = 0; i < count; i++) {
    restoreLine();
    document.getElementsByClassName('d-count')[i].value = JSON.parse(localStorage.getItem('d-count' + i.toString()));
    document.getElementsByClassName('d-type')[i].value = JSON.parse(localStorage.getItem('d-type' + i.toString()));
    document.getElementsByClassName('pos-neg')[i].value = JSON.parse(localStorage.getItem('pos-neg' + i.toString()));
    document.getElementsByClassName('d-mod')[i].value = JSON.parse(localStorage.getItem('d-mod' + i.toString()));
    document.getElementsByClassName('mod-target')[i].value = JSON.parse(localStorage.getItem('mod-target' + i.toString()));
    var dLabel = document.getElementsByClassName('label')[i];
    dLabel.value = localStorage.getItem('label' + i.toString());
    dLabel.placeholder = labelPlaceholder(i);
  }
}

// Function to control dice input values
function diceControl(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;
  if (target.value > 99)
    target.value = target.max;
  else if (target.value < 1)
    target.value = target.min;

  saveChange(e);
}

// Function to restore dice settings on page load
function restoreDice() {
  if (document.getElementById('save-checkbox').checked)
    loadAll();
  else
    document.getElementById('add-line').click();

  document.getElementsByClassName('remove-line')[0].disabled = true;

  if (ulCount() == 1)
    document.getElementById('roll-all').disabled = true;
}

// Function to generate a placeholder label for a dice line
function labelPlaceholder(x) {
  var dCount = parseInt(document.getElementsByClassName('d-count')[x].value);
  var dSelect = document.getElementsByClassName('d-type')[x];
  var dType = dSelect.options[dSelect.selectedIndex].text;
  var posNeg = document.getElementsByClassName('pos-neg')[x];
  var posNegVal = posNeg.value;
  var posNegText = posNeg.options[posNeg.selectedIndex].text;
  var dMod = parseInt(document.getElementsByClassName('d-mod')[x].value);
  var modTarget = document.getElementsByClassName('mod-target')[x];
  var modTargetVal = modTarget.value;
  var modTargetText = modTarget.options[modTarget.selectedIndex].text;

  var label = dCount.toString() + dType + " " + posNegText + " " + dMod.toString() + " " + modTargetText;
  return label;
}

// Function to count the number of dice lines
function ulCount() {
  var ulCount = document.getElementsByClassName('d-line').length;
  return ulCount;
}

// Function to count the number of child nodes in a list
function lineCount(listNode) {
  return listNode.childNodes.length;
}

// Function to delete an element from the DOM
function deleteElement(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

// Function to populate the dice type select element
function populateDSelect(dSelect) {
  const DTYPE = ['d2', 'd3', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

  for (var d = 0; d < 9; d++) {
    dSelect.options[d] = new Option(DTYPE[d], d);
  }

  dSelect.selectedIndex = "3"; // sets default selection to d6
}

// Function to add a new dice roller line
function addLine() {
  var count = ulCount();

  if (count > 9) {
    return false;
  }

  if (count >= 1) {
    document.getElementById('roll-all').disabled = false;
  }

  if (count >= 9) {
    document.getElementById('add-line').disabled = true;
  }

  var newLine = document.createElement("li");
  newLine.innerHTML = lineHTML();
  var list = document.getElementById("d-list");
  list.insertBefore(newLine, list.childNodes[count]);

  var dSelect = document.getElementsByClassName('d-type')[count];
  populateDSelect(dSelect);

  document.getElementsByClassName('label')[count].placeholder = labelPlaceholder(count);

  if (document.getElementById('save-checkbox').checked) {
    saveLine(ulCount() - 1);
    localStorage.setItem('line-count', ulCount());
  }
}

// Function to restore a dice roller line from saved settings
function restoreLine() {
  var count = ulCount();

  if (count > 9) {
    return false;
  }

  if (count >= 1) {
    document.getElementById('roll-all').disabled = false;
  }

  if (count >= 9) {
    document.getElementById('add-line').disabled = true;
  }

  var newLine = document.createElement("li");
  newLine.innerHTML = lineHTML();
  var list = document.getElementById("d-list");
  list.insertBefore(newLine, list.childNodes[count]);

  var dSelect = document.getElementsByClassName('d-type')[count];
  populateDSelect(dSelect);
}

// Function to remove a dice roller line
function removeLine(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;

  var parent = target.parentElement;
  var count = ulCount();

  if (count <= 2) {
    document.getElementById('roll-all').disabled = true;
  }

  if (count <= 10) {
    document.getElementById('add-line').disabled = false;
  }

  deleteElement(parent);

  if (document.getElementById('save-checkbox').checked) {
    saveAll();
  }
}

// Function to handle the roll button click for a single line
function clickRoll(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;
  let x = getAncestorIndex('LI', target);
  writeLogLine('<br><div class="division-line"></div>');
  rollDiceLine(x);
  writeLogLine(timeStamp());
}

// Function to handle the roll all button click
function clickRollAll() {
  let count = ulCount();
  writeLogLine('<br><div class="division-line"></div>');
  for (var x = count - 1; x >= 0; x--) {
    rollDiceLine(x);
  }
  writeLogLine(timeStamp());
}

// Function to roll dice for a single line
function rollDiceLine(x) {
  var xText = x + 1;
  var dCount = parseInt(document.getElementsByClassName('d-count')[x].value);
  var dSelect = document.getElementsByClassName('d-type')[x];
  var dType = dSelect.options[dSelect.selectedIndex].text;
  var posNeg = document.getElementsByClassName('pos-neg')[x];
  var posNegVal = posNeg.value;
  var posNegText = posNeg.options[posNeg.selectedIndex].text;
  var dMod = parseInt(document.getElementsByClassName('d-mod')[x].value);
  var modTarget = document.getElementsByClassName('mod-target')[x];
  var modTargetVal = modTarget.value;
  var modTargetText = modTarget.options[modTarget.selectedIndex].text;
  var dLabel = document.getElementsByClassName('label')[x];
  var dPlaceholder = dLabel.placeholder;
  var dLabelVal = dLabel.value;

  if (document.getElementById('sound-checkbox').checked) {
    var audio = new Audio('sounds/dice.mp3');
    audio.play();
  }

  if (dLabelVal) {
    dLabelVal = ", " + dLabelVal;
  }

  var logHTML = '<p class="log-text">Rolling line ' + xText.toString() + dLabelVal + ' : <b>' + dPlaceholder + ' </b> : ';

  var dSide = parseInt(dType.substr(1));

  var dRoll, mod = 0;
  var dTotal = 0;

  var rollString = "";

  if (modTargetVal == 0) {
    mod = dMod;
    if (posNegText == "-") {
      mod = 0 - dMod;
    }
  }

  for (var d = 0; d < dCount; d++) {
    dRoll = Math.floor(Math.random() * dSide) + 1;

    var mdRoll = dRoll + mod;
    if (mdRoll < 0) {
      mdRoll = 0; // prevents less than 0
    }
    rollString += dRoll.toString();
    if (dMod > 0 && modTargetVal == 0) {
      rollString += " " + posNegText + " " + dMod.toString();
    }
    rollString += ", ";
    dTotal += mdRoll;
  }

  if (modTargetVal == 1 && dMod > 0) {
    mod = dMod;
    if (posNegText == "-") {
      mod = 0 - dMod;
    }

    dTotal += mod;
    if (dTotal < 0) {
      dTotal = 0; // prevents less than 0
    }
    rollString += posNegText + " " + dMod.toString() + ", ";
  }

  rollString += "<span class='log-line-total'>TOTAL: <b class='red'>" + dTotal.toString() + "</b></span></p>";

  var resultdiv = document.getElementsByClassName("line-result")[x];
  resultdiv.innerHTML = "";
  resultdiv.appendChild(document.createTextNode(dTotal));

  writeLogLine(logHTML + rollString);
}

// Function to generate a timestamp
function timeStamp() {
  var timeStamp = new Date();
  return '<i class="timestamp">' + timeStamp + '</i><br>';
}

// Function to write a line to the dice roll log
function writeLogLine(lineString) {
  var newLine = document.createElement("li");
  newLine.innerHTML = lineString;
  var log = document.getElementById("log-list");

  log.insertBefore(newLine, log.childNodes[0]);
}