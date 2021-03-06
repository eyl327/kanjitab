function loadKanji(minFrame,maxFrame,ifCorrect,ifIncorrect,attempts,delay,customPage,fontFamily,fontFamilyInput,characterSet) {
  $.getJSON(characterSet, function(json) {
    var jsonLength = Object.keys(json).length;
    document.getElementById("kanji-input").value = "";
    if (json[0]['onyomi'] != undefined) {
      document.getElementById('title-heading').innerHTML = "read the kanji";
      document.getElementById('subtitle-heading').innerHTML = "type an On or Kun reading above and hit enter";
    }
    else if (json[0]['romanization'] != undefined) {
      document.getElementById('title-heading').innerHTML = "read the kana";
      document.getElementById('subtitle-heading').innerHTML = "type the pronunciation above and hit enter";
    }
    else {
      document.getElementById('title-heading').innerHTML = "translate the kanji";
      document.getElementById('subtitle-heading').innerHTML = "type the translation above and hit enter";
    }
    if (minFrame > jsonLength) {minFrame = jsonLength;}
    if (maxFrame > jsonLength) {maxFrame = jsonLength;}
    document.getElementById("minFrame").value = minFrame;
    document.getElementById("maxFrame").value = maxFrame;
    var numOfKanji = maxFrame - minFrame;
    var kanjiIdx = Math.floor(Math.random() * (numOfKanji + 1));
    kanjiIdx += minFrame - 1;
    console.log("frame: "+(kanjiIdx+1));
    document.getElementById('kanji-text').innerHTML = json[kanjiIdx]['code'];
    var attemptsRemaining = attempts;

    document.getElementById("kanji-form").addEventListener("submit", function(event){
        event.preventDefault();
        var userTranslation = $("#kanji-input").val().toLowerCase().trim();
        var validTranslations;
        if (json[0]['meaning'] != undefined) {
          validTranslations = json[kanjiIdx]['meaning'].toLowerCase().split(', ');
        }

        if (json[0]['onyomi'] != undefined) {
          validTranslations = [];
          validTranslations = validTranslations.concat(json[kanjiIdx]['onyomi'].toLowerCase().split(', '));
          validTranslations = validTranslations.concat(json[kanjiIdx]['onromaji'].toLowerCase().split(', '));
          validTranslations = validTranslations.concat(json[kanjiIdx]['onhiragana'].toLowerCase().split(', '));
          validTranslations = validTranslations.concat(json[kanjiIdx]['kunyomi'].toLowerCase().split(', '));
          validTranslations = validTranslations.concat(json[kanjiIdx]['kunromaji'].toLowerCase().split(', '));
        }

        if (json[0]['romanization'] != undefined) {
          validTranslations = json[kanjiIdx]['romanization'].toLowerCase().split(', ');
        }

        console.log(validTranslations)

        if (validTranslations.indexOf(userTranslation)==-1){
          // fail condition
          if (attemptsRemaining>1) {
            document.getElementById('subtitle-heading').innerHTML = "Incorrect. Try again!";
            attemptsRemaining--;
          }
          else {
            // document.getElementById('subtitle-heading').innerHTML = "oops, the correct translation is: " + validTranslations.join(' or ') + "!";
            console.log(ifIncorrect);
            if (ifIncorrect==1) {window.close();}
            else if (ifIncorrect==2 && json[0]['onyomi'] != undefined) {document.getElementById('subtitle-heading').innerHTML = "Incorrect. The answer is: " + validTranslations.join(' or ') + ".";}
            else if (ifIncorrect==2) {document.getElementById('subtitle-heading').innerHTML = "Incorrect. The answer is: " + validTranslations[0] + ".";}
          }
        } else {
          // success condition
          document.getElementById('subtitle-heading').innerHTML = "Correct!";
          console.log(ifCorrect);
          if (ifCorrect==1) {setTimeout(function(){window.location.replace("http://www.google.com")}, delay);}
          if (ifCorrect==2) {setTimeout(function(){window.location.replace(customPage)}, delay);}
          if (ifCorrect==3) {setTimeout(function(){loadKanji(minFrame,maxFrame,ifCorrect,ifIncorrect,attempts,delay,customPage,fontFamily,fontFamilyInput,characterSet);}, delay);}
        }

    });
  });
}

function customPageDiv() {
  if(document.getElementById("ifCorrect").value==2) {
    document.getElementById("customPageDiv").style.display="inline-block"
  }
  else {
    document.getElementById("customPageDiv").style.display="none"
  }
  resizeSettings(true);
}

function changeFontFamily(){
  var fontFamily = $("#fontFamily").children("option").filter(":selected").text();
  if (fontFamily == "Custom") {
    document.getElementById("fontFamilyInputDiv").style.display="inline-block"
  }
  else if (fontFamily == "Default") {
    document.getElementById("fontFamilyInputDiv").style.display="none"
    document.getElementById("fontFamilyInput").value = "";
  }
  else {
    document.getElementById("fontFamilyInputDiv").style.display="none"
    document.getElementById("fontFamilyInput").value = fontFamily;
  }
  document.getElementById("kanji-text").style.fontFamily = document.getElementById("fontFamilyInput").value;
  resizeSettings(true);
}

function changeCharacterSet() {
  characterSet = document.getElementById("characterSet").value;
  $.getJSON(characterSet, function(json) {
    var jsonLength = Object.keys(json).length;
    var minFrame = parseInt(document.getElementById("minFrame").value);
    var maxFrame = parseInt(document.getElementById("maxFrame").value);
    if (minFrame>jsonLength) {
      document.getElementById("minFrame").value = 1;
    }
    if (maxFrame>jsonLength) {
      document.getElementById("maxFrame").value = jsonLength;
    }
    setCookie("minFrame", minFrame, 180);
    setCookie("maxFrame", maxFrame, 180);
  });
  resizeSettings(true);
}

function changeTheme() {
  theme = document.getElementById("theme").value;
  setCookie("theme", theme, 180);
  document.getElementsByTagName("body")[0].className = theme;
  document.getElementById("kanji-input").className = theme;
}

function resizeSettings(stayExpanded) {
    var sHeight = document.getElementById('settings').clientHeight;
    if ((sHeight > 0 && stayExpanded) || (sHeight == 0 && !stayExpanded)) {
      document.getElementById('settings').style.height = document.querySelector('.measuringWrapper').clientHeight + "px";
      document.getElementById("plusMinus").innerHTML='−';
    } else {
      document.getElementById('settings').style.height = 0;
      document.getElementById("plusMinus").innerHTML='+';
    }
}

function validateSettings(reload) {
  var em = "";
  var minFrame = parseInt(document.getElementById("minFrame").value);
  var maxFrame = parseInt(document.getElementById("maxFrame").value);
  var ifCorrect = parseInt(document.getElementById("ifCorrect").value);
  var ifIncorrect = parseInt(document.getElementById("ifIncorrect").value);
  var attempts = parseInt(document.getElementById("attempts").value);
  var delay = parseInt(document.getElementById("delay").value);
  var customPage = document.getElementById("customPage").value;
  var fontFamily = $("#fontFamily").children("option").filter(":selected").text();
  var fontFamilyInput = document.getElementById("fontFamilyInput").value;
  var characterSet = document.getElementById("characterSet").value;
  if (minFrame < 1) {em+="· Min frame must be greater than or equal to 1.<br/>"}
  if (maxFrame < 1) {em+="· Max frame must be greater than or equal to 1.<br/>"}
  if (maxFrame < minFrame) {em+="· Max frame must be greater than or equal to min frame.<br/>"}
  if (attempts < 1) {em+="· Attempts must be greater than or equal to 1.<br/>"}
  if (delay < 0) {em+="· Delay must be greater than or equal to 0.<br/>"}
  if (ifCorrect == 2) {
    var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if (!pattern.test(customPage)) {em+="· Custom redirect URL is invalid.<br/>"}
  }
  document.getElementById("errorMessage").innerHTML = em;
  if (em == "") {
    console.log("settings saved")
    setCookie("minFrame", minFrame, 9999);
    setCookie("maxFrame", maxFrame, 9999);
    setCookie("ifCorrect", ifCorrect, 9999);
    setCookie("ifIncorrect", ifIncorrect, 9999);
    setCookie("attempts", attempts, 9999);
    setCookie("delay", delay, 9999);
    setCookie("customPage", customPage, 9999);
    setCookie("fontFamily", fontFamily, 9999);
    setCookie("fontFamilyInput", fontFamilyInput, 9999);
    setCookie("characterSet", characterSet, 9999);
    if (reload) {
      loadKanji(minFrame,maxFrame,ifCorrect,ifIncorrect,attempts,delay,customPage,fontFamily,fontFamilyInput,characterSet);
    }
  }
}

function checkCookie() {
    var minFrame = getCookie("minFrame") == "" ? 1 : getCookie("minFrame");
    var maxFrame = getCookie("maxFrame") == "" ? 2200 : getCookie("maxFrame");
    var ifCorrect = getCookie("ifCorrect") == "" ? 1 : getCookie("ifCorrect");
    var ifIncorrect = getCookie("ifIncorrect") == "" ? 2 : getCookie("ifIncorrect");
    var attempts = getCookie("attempts") == "" ? 1 : getCookie("attempts");
    var delay = getCookie("delay") == "" ? 400 : getCookie("delay");
    var customPage = getCookie("customPage") == "" ? "http://www.google.com" : getCookie("customPage");
    var fontFamily = getCookie("fontFamily") == "" ? "Default" : getCookie("fontFamily");
    var fontFamilyInput = getCookie("fontFamilyInput") == "" ? "" : getCookie("fontFamilyInput");
    characterSet = getCookie("characterSet") == "" ? "rtkKanji.json" : getCookie("characterSet");
    var theme = getCookie("theme") == "" ? "light" : getCookie("theme");
    document.getElementById("minFrame").value = minFrame;
    document.getElementById("maxFrame").value = maxFrame;
    document.getElementById("ifCorrect").value = ifCorrect;
    document.getElementById("ifIncorrect").value = ifIncorrect;
    document.getElementById("attempts").value = attempts;
    document.getElementById("delay").value = delay;
    document.getElementById("customPage").value = customPage;
    document.getElementById("fontFamily").value = fontFamily;
    document.getElementById("fontFamilyInput").value = fontFamilyInput;
    document.getElementById("characterSet").value = characterSet;
    document.getElementById("theme").value = theme;
    customPageDiv();
    changeFontFamily();
    changeTheme();
    validateSettings(true);
}

function setup() {
  document.getElementById('reloadButton').onclick = function () {validateSettings(true);};
  document.getElementById('toggleSettings').onclick = function () {resizeSettings(false);};
  document.getElementById('ifCorrect').onchange = function () {customPageDiv();};
  document.getElementById('fontFamily').onchange = function () {changeFontFamily();};
  document.getElementById('characterSet').onchange = function () {changeCharacterSet();};
  document.getElementById('theme').onchange = function () {changeTheme();};
  document.getElementById('resetToDefaults').onclick = function () {clearCookies();checkCookie();};
  document.getElementById("minFrame").onblur = function () {validateSettings(false);};
  document.getElementById("maxFrame").onblur = function () {validateSettings(false);};
  document.getElementById("ifCorrect").onblur = function () {validateSettings(false);};
  document.getElementById("ifIncorrect").onblur = function () {validateSettings(false);};
  document.getElementById("attempts").onblur = function () {validateSettings(false);};
  document.getElementById("delay").onblur = function () {validateSettings(false);};
  document.getElementById("customPage").onblur = function () {validateSettings(false);};
  document.getElementById("fontFamily").onblur = function () {validateSettings(false);};
  document.getElementById("fontFamilyInput").onblur = function () {validateSettings(false);};
  document.getElementById("characterSet").onblur = function () {validateSettings(false);};
  document.getElementById("theme").onblur = function () {validateSettings(false);};
  $("#kanji-input").focus();
  checkCookie();
}

window.onload = setTimeout(setup, 1);