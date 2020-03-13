/**
 * et a new text cookie or change an existing cookie
 * @param {HTMLElement} editor
 */
function setTextCookie(editor) {
  if (getCookie("acceptCookies") == "yes" && editor.innerText != "") {
    // Expiration date
    let date = new Date();
    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    // Replace "\n" in string because they're not interpreted in the cookie
    let text = editor.innerText.replace(/\n/g, "\\n")
    if (text.substring(text.length - 2) == "\\n") text = text.substring(0, text.length - 2);
    // Cookie
    document.cookie = "text=" + text + "; " + expires + "; " + "path=/";
  }
  else {
    textCookie = getCookie("text");
    if (textCookie) resetCookie("text");
  }
}

/**
 * Set a new cookie
 * @param {string} name : cookie name
 * @param {string} value : cookie value
 * @param {int} duration : duration (number of days)
 */
function setCookie(name, value, duration) {
  if (getCookie("acceptCookies") == null && name != "acceptCookies") return;
  let date = new Date();
  date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  // Replace "\n" in string because they're not interpreted in the cookie
  document.cookie = name + "=" + value + "; " + expires + "; " + "path=/";
}


/**
 * Return a cookie that has the same name as the one passed as parameter
 * @param {string} cookieName : cookie name
 * @return {string} : cookie value
 */
function getCookie(cookieName) {
  // Decoded cookie
  let decodedCookie = decodeURIComponent(document.cookie);
  // Splitted cookie
  let cookie = decodedCookie.split(';');

  for(var i = 0; i < cookie.length; i++) {
    var str = cookie[i];

    // Extract cookie from string at current index without useless spaces
    while (str.charAt(0) == " ") str = str.substring(1);
    // Return the cookie value if the name corresponds to the parameter
    if (str.indexOf(cookieName + "=") != -1) return str.substring((cookieName + "=").length, str.length);
  }

  return null;
}

/**
 * Reset the cookie that has the same name as the one passed as parameter
 * @param {string} cookieName : cookie name
 */
function resetCookie(cookieName) {
  if (getCookie(cookieName != null)) document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Make a file with the text then open a download dialog
 * @param {string} filetype: HTML/MD/txt
 */
function save(filetype) {
  // Get filename from text input
  let filename = document.getElementById("filename").value;
  if (!filename || filename == "") {
    alert("Filename can't be empty");
    return;
  }

  // Remove the dialog
  filetypeDialog.style.display = "none";
  // Get link tag which will be used to open download dialog
  let save = document.getElementById("save");
  let contentType, extension, target;

  if (filetype == "HTML") {
    contentType = "text/html";
    extension = ".html";
    target = display.innerHTML;
  }
  else if(filetype == "MD") {
    contentType = "text/plain";
    extension = ".md";
    target = editor.innerText;
  }
  else {
    contentType = "text/plain";
    extension = ".txt";
    target = removeMdTags(editor.innerText);
  }

  // File creation
  let file = new Blob([target], {type: contentType});
  // Settings for download link
  save.href = URL.createObjectURL(file);
  save.download = filename + extension;
  // Open download dialog
  save.click();
  // Reset the download link
  save.href = "#";
  // Reset the input value
  document.getElementById("filename").value = "";
}

// Loads a file then put its content in editor div
function load() {
  // Get the file selected by user through file opening dialog
  let file = document.getElementById("fileLoader").files[0];
  // Convert file to stream then put its content in "editor" div
  file.text().then(text => {
    editor.innerText = text;
    parse();
  });
}

/**
 * Close a dialog corresponding to the id passed as parameter
 * @param {string} dialogID : the id of the dialog to close
 */
function closeDialog(dialogID) {
  let dialog = document.getElementById(dialogID);
  if (dialog) {
    dialog.style.display = "none";
    editor.focus();
  }
}

// Display "about this"
function displayAboutThis() {
  document.getElementById("about-this").style.display = "block";
}

/**
 * Set/unset nightmode based on "active" boolean
 * @param {boolean} active
 */
function setNightmode(active) {
  let htmlPage = document.getElementsByTagName("html")[0];
  let editor = document.getElementById("editor");

  if (active) {
    htmlPage.style.backgroundColor = "#292929";
    htmlPage.style.color = "white";
    htmlPage.style.transitionDuration = "0.1s";
    editor.style.borderColor = "white";
    setCookie("nightmode", "yes", 30);
  }
  else {
    htmlPage.style.backgroundColor = "white";
    htmlPage.style.color = "black";
    editor.style.borderColor = "black";
    setCookie("nightmode", "no", 30);
  }
}

// Return true if nightmode is active, or else no
function isNightmodeActive() {
  nightmodeCookie = getCookie("nightmode");
  if (nightmodeCookie) {
    if (nightmodeCookie == "yes") return true;
    else return false;
  }
}

function removeMdTags(mdText) {
  mdText.replace(/# /g, "");
  mdText.replace(/## /g, "");
  mdText.replace(/### /g, "");
  mdText.replace(/#### /g, "");
  mdText.replace(/##### /g, "");
  mdText.replace(/###### /g, "");

  return mdText;
}
