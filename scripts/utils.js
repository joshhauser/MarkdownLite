function removeMdTags(mdText) {
  mdText.replace(/# /g, "");
  mdText.replace(/## /g, "");
  mdText.replace(/### /g, "");
  mdText.replace(/#### /g, "");
  mdText.replace(/##### /g, "");
  mdText.replace(/###### /g, "");

  return mdText;
}

/**
 * 
 * @param {*} editor 
 * @param {*} editorId 
 */
function setTextCookie(editor, editorId) {
  if (getCookie("acceptCookies") == "yes" && editor.innerText != "") {
    let date = new Date();
    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
    let expires = `expires=${date.toUTCString()}`;
    let text = editor.innerText.replace(/\n/g, "\\n");
    if (text.substring(text.length - 2) == "\\n") text = text.substring(0, text.length - 2);
    document.cookie = `editor-${editorId}=${text}; ${expires}; path=/`;
  }
  else {
    textCookie = getCookie(`editor-${editorId}`);
    if (textCookie) resetCookie(`editor-${editorId}`);
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
  let cookie = decodedCookie.split('; ');

  for(let i = 0; i < cookie.length; i++) {
    let str = cookie[i];

    // Extract cookie from string at current index without useless spaces
    while (str.charAt(0) == " ") str = str.substring(1);
    // Return the cookie value if the name corresponds to the parameter
    if (str.indexOf(cookieName + "=") != -1) return str.substring((cookieName + "=").length, str.length);
  }

  return null;
}

function getTextsCookies() {
  let decodedCookies = decodeURIComponent(document.cookie);
  let cookies = decodedCookies.split('; ');
  let textCookies = cookies.filter((elt) => elt.match(/editor-[1-9]+=.*/g));

  return textCookies;
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
function saveFile(filetype) {
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
    const currentDisplay = getCurrentDisplay();
    if (currentDisplay) target = currentDisplay.innerHTML;
    else target = null;
  }
  else if(filetype == "MD") {
    contentType = "text/plain";
    extension = ".md";
    const currentEditor = getCurrentEditor();
    if (currentEditor) target = currentEditor.innerText;
    else target = null;
  }
  else {
    contentType = "text/plain";
    extension = ".txt";
    const currentDisplay = getCurrentDisplay();
    if (currentDisplay) target = removeMdTags(currentDisplay.innerText);
    else target = null;
  }

  if (target) {
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
  else {
    alert("There's a problem with file saving");
  }
}

function loadFile() {
  let file = document.getElementById("fileLoader").files[0];
  if (file) {
    let currentEditor = getCurrentEditor();
    if (currentEditor) {
      file.text().then(text => {
        currentEditor.innerText = text;
        parse(text);
      })
    }
  }
}

function getTexts() {
  let textsCookies = getTextsCookies();
  if (textsCookies.length > 0) {
    let texts = [];
    textsCookies.forEach(cookie => texts.push(cookie.split('=')[1]));
    return texts;
  }

  return null;
}

function getCurrentEditor() {
  let activeTabView = document.getElementsByClassName("activeTabView");
  let currentEditor = activeTabView[0].getElementsByClassName("wysiwyg-editor");

  return currentEditor[0] || null;
}

function getCurrentDisplay() {
  let activeTabView = document.getElementsByClassName("activeTabView");
  let currentDisplay = activeTabView[0].getElementsByClassName("wysiwyg-display");

  return currentDisplay[0] || null;
}

export {
  removeMdTags,
  getCookie,
  getTexts,
  setCookie,
  setTextCookie,
  saveFile,
  loadFile,
  resetCookie,
  getTextsCookies,
  getCurrentDisplay,
  getCurrentEditor
};