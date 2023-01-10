import * as utils from './utils.js';
import * as uiActions from './uiActions.js';
import * as parseActions from './parser.js';
import TabLinkButton from './TabButton.js';

window.onload = () => {
  // "editors" div
  let defaultEditor = document.getElementsByClassName("wysiwyg-editor")[0];
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
  let alreadyVisitedCookie = utils.getCookie("alreadyVisited");
  // Night mode cookie
  let nightmodeCookie = utils.getCookie("nightmode");
  // "Cookies acceptation" cookie
  let cookiesAcception = utils.getCookie("acceptCookies");
  // Default tablink
  let defaultTabLink = document.getElementsByClassName("tablink")[0];

  uiActions.tabLinkButtons.push(new TabLinkButton(1, defaultTabLink));

  // Add event listener for "load" button
  document.getElementById("load").addEventListener("click", () => {
    // Open the file opening dialog
    document.getElementById("fileLoader").click();
    // Call load() once the user selected a file
    document.getElementById("fileLoader").onchange = load;
  });

  // Displays filetypeDialog
  openFiletypeDialog.onclick = () => { filetypeDialog.style.display = "block"; }

  if (cookiesAcception && cookiesAcception == "yes") cookiesAlertBanner.style.display = "none";
  else cookiesAlertBanner.style.display = "block"

  // Display cheat sheet for first visit
  if (!alreadyVisitedCookie) {
    cheatsSheet.style.display = "block";
    utils.setCookie("alreadyVisited", "yes", 30);
  }
  else {
    cheatsSheet.style.display = "none";
  }

  let texts = utils.getTexts();
  if (texts != null) {
    if (texts.length >= 1) {
      defaultEditor.innerText = texts[0];
    }

    if (texts.length > 1) {
      for (let i = 1; i < texts.length; i++) {
        let newEditor = uiActions.addTab();
        newEditor.innerText = texts[i];
      }
    }
  }

  // Refresh nightmode
  if (nightmodeCookie && nightmodeCookie == "yes") {
    uiActions.setNightmode(true);
    nightmodeSwitch.checked = true;
  }
  else {
    uiActions.setNightmode(false);
    nightmodeSwitch.checked = false;
  }

  // At each char input in "editor", the script call parse()
  let timeout = null;
  defaultEditor.addEventListener("input", () => {
    const html = defaultEditor.children;
    let text = "";
    for (const node of html) {
      const nodeText = node.innerText;
      if (nodeText === "\n") text += nodeText
      else text += nodeText + "\n";
    }
    parseActions.parse(text);
    // Save text as a cookie at each input (temporary)

    let timeout = setTimeout(() => utils.setTextCookie(defaultEditor, 1), 3000)
  });


  // Removes filetypeDialog if the user clicks outside
  window.onclick = (event) => {
    if (event.target.id == "filetypeDialog") {
      filetypeDialog.style.display = "none";
      let currentEditor = utils.getCurrentEditor();
      if (currentEditor) currentEditor.focus()
    }
    else if (event.target.id == "cheats-sheet") {
      cheatsSheet.style.display = "none";
      let currentEditor = utils.getCurrentEditor();
      if (currentEditor) currentEditor.focus()
    }
    else if (event.target.id == "about-this") {
      aboutThis.style.display = "none";
      let currentEditor = utils.getCurrentEditor();
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
