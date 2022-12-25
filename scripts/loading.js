// This script loads necessary content for the app


window.onload = () => {
  // Add event listener for "load" button
  document.getElementById("load").addEventListener("click", () => {
    // Open the file opening dialog
    document.getElementById("fileLoader").click();
    // Call load() once the user selected a file
    document.getElementById("fileLoader").onchange = load;
  });

  // "editors" div
  let defaultEditor = document.getElementsByClassName("wysiwyg-editor")[0];
  // "display" div
  let displays = document.getElementsByClassName("wysiwyg-display");
  // Dialog used to choose file type for saving
  let filetypeDialog = document.getElementById("filetypeDialog");
  // Button to open filetypeDialog
  let openFiletypeDialog = document.getElementById("openFiletypeDialog");
  // Cheats sheet
  let cheatsSheet = document.getElementById("cheats-sheet");
  // About this
  let aboutThis = document.getElementById("about-this");
  // Nightmode switch
  let nightmodeSwitch = document.getElementById("nightmode-input");
  // Cookies alert banner
  let cookiesAlertBanner = document.getElementById("cookies-alert");
  // Cookie "first visit"
  let alreadyVisitedCookie = getCookie("alreadyVisited");
  // Night mode cookie
  let nightmodeCookie = getCookie("nightmode");
  // "Cookies acceptation" cookie
  let cookiesAcception = getCookie("acceptCookies");


  if (cookiesAcception && cookiesAcception == "yes") cookiesAlertBanner.style.display = "none";
  else cookiesAlertBanner.style.display = "block"

  // Display cheat sheet for first visit
  if (!alreadyVisitedCookie) {
    cheatsSheet.style.display = "block";
    setCookie("alreadyVisited", "yes", 30);
  }
  else {
    cheatsSheet.style.display = "none";
  }

  let texts = getTexts();
  if (texts != null) {
    if (texts.length >= 1) {
      defaultEditor.innerText = texts[0];
    }
    
    if (texts.length > 1) {
      for (let i = 1; i < texts.length; i++) {
        let newEditor = addTab();
        newEditor.innerText = texts[i];
      }
    }
  }



  // Refresh nightmode
  if (nightmodeCookie && nightmodeCookie == "yes") {
    setNightmode(true);
    nightmodeSwitch.checked = true;
  }
  else {
    setNightmode(false);
    nightmodeSwitch.checked = false;
  }

  // At each char input in "editor", the script call parse()
  let timeout = null;
  defaultEditor.addEventListener("input", () => {
    parse(defaultEditor.innerText);
    // Save text as a cookie at each input (temporary)

    let timeout = setTimeout(() => setTextCookie(defaultEditor, 1), 3000)
  });

  // Displays filetypeDialog
  openFiletypeDialog.onclick = () => { filetypeDialog.style.display = "block"; }

  // Removes filetypeDialog if the user clicks outside
  window.onclick = (event) => {
    if (event.target.id == "filetypeDialog") {
      filetypeDialog.style.display = "none";
      let currentEditor = getCurrentEditor();
      if (currentEditor) currentEditor.focus()
    }
    else if (event.target.id == "cheats-sheet") {
      cheatsSheet.style.display = "none";
      let currentEditor = getCurrentEditor();
      if (currentEditor) currentEditor.focus()
    }
    else if (event.target.id == "about-this") {
      aboutThis.style.display = "none";
      let currentEditor = getCurrentEditor();
      if (currentEditor) currentEditor.focus()
    }
  }

  window.addEventListener("keydown", (event) => {
    if (event.code == "Escape" && cookiesAlertBanner.style.display == "none") {
      if (window.getComputedStyle(filetypeDialog).display == "block") filetypeDialog.style.display = "none";
      if (window.getComputedStyle(cheatsSheet).display == "block") cheatsSheet.style.display = "none";
      if (window.getComputedStyle(aboutThis).display == "block") aboutThis.style.display = "none";
    }
  });
}

function getCurrentEditor() {
  let activeTabView = document.getElementsByClassName("activeTabView");
  let currentEditor = activeTabView[0].getElementsByClassName("wysiwyg-editor");

  return currentEditor[0] || null;
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