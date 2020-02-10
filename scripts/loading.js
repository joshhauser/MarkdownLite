// This script loads necessary content for the app

// Set a new text cookie or change an existing cookie
function setTextCookie() {
  if (editor.innerText != "") {
    // Expiration date
    let date = new Date();
    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    // Replace "\n" in string because they're not interpreted in the cookie
    let text = editor.innerText.replace(/\n/g, "\\n")
    // Cookie
    document.cookie = "text=" + text.substring(0, text.length  - 2) + "; " + expires + "; " + "path=/";
  }
}

// Return a cookie that has the same name as the one passed as parameter
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

// Reset the cookie that has the same name as the one passed as parameter
function resetCookie(cookieName) {
  if (getCookie(cookieName != null)) document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.onload = () => {
  // Add event listener for "load" button
  document.getElementById("load").addEventListener("click", () => {
    // Open the file opening dialog
    document.getElementById("fileLoader").click();
    // Call load() once the user selected a file
    document.getElementById("fileLoader").onchange = load;
  });

  // "editor" div
  var editor = document.getElementById("editor");
  // "display" div
  var display = document.getElementById("display");
  // Dialog used to choose file type for saving
  var filetypeDialog = document.getElementById("filetypeDialog");
  // Button to open filetypeDialog
  var openFiletypeDialog = document.getElementById("openFiletypeDialog");
  // Cheats sheet
  var cheatsSheet = document.getElementById("cheats-sheet");
  // About this
  var aboutThis = document.getElementById("about-this");
  // Text cookie
  var textCookie = getCookie("text");

  if(textCookie && textCookie != "") {
    editor.innerText = textCookie.replace(/\\n/g, "\n");
    parse();
  }

  // At each char input in "editor", the script call parse()
  editor.addEventListener("input", () => {
    parse();
    // Save text as a cookie at each input (temporary)
    setTextCookie();
  });
  
  // Displays filetypeDialog
  openFiletypeDialog.onclick = () => { filetypeDialog.style.display = "block"; }

  // Removes filetypeDialog if the user clicks outside
  window.onclick = (event) => {
    if (event.target.id == "filetypeDialog") {
      filetypeDialog.style.display = "none";
      editor.focus();
    }
    else if (event.target.id == "cheats-sheet") {
      cheatsSheet.style.display = "none";
      editor.focus();
    }
    else if (event.target.id == "about-this") {
      aboutThis.style.display = "none";
      editor.focus();
    }
  }

  window.addEventListener("keydown", (event) => {
    if (event.code == "Escape") {
      if (window.getComputedStyle(filetypeDialog).display == "block") filetypeDialog.style.display = "none";
      if (window.getComputedStyle(cheatsSheet).display == "block") cheatsSheet.style.display = "none";
      if (window.getComputedStyle(aboutThis).display == "block") aboutThis.style.display = "none";
    }
  });
}