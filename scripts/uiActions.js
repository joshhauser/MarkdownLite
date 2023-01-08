import * as parseActions from './parser.js';
import * as utils from './utils.js';

let tabsCount = 1;
let currentTabIndex = 1;
let timeouts = [];

/**
 * Close a dialog corresponding to the id passed as parameter
 * @param {String} dialogID the id of the dialog to close
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
 * @param {boolean} active is true if nightmode should be activated
 */
function setNightmode(active) {
  let htmlPage = document.getElementsByTagName("html")[0];
  if (active) htmlPage.classList.add("darkmode");
  else htmlPage.classList.remove("darkmode");
}

/**
 * Add a new tab
 * @returns the editor created in the new tab
 */
function addTab() {
  tabsCount++;
  currentTabIndex = tabsCount;
  let tabLinks = document.getElementsByClassName("tab")[0];
  let tabViews = document.getElementById("tabViews");
  let newTabBtn = document.getElementById("new-tab-btn");
  newTabBtn.remove();

  // De-active current tab
  let activeTabLink = document.getElementsByClassName("activeTab");
  activeTabLink[0].classList.remove("activeTab");
  let activeTabView = document.getElementsByClassName("activeTabView");
  activeTabView[0].classList.remove("activeTabView");

  let newTab = document.createElement("button");
  newTab.classList.add("tablink","activeTab");
  newTab.innerText = tabsCount;
  newTab.onclick = setTab.bind(newTab, [newTab.innerText]);
  newTab.oncontextmenu = (event) => { event.preventDefault(); }
  newTab.onmousedown = (event) => {
    if (event.button == 2) deleteTab(newTab.innerText);
  }

  // Add new tab link
  tabLinks.appendChild(newTab);
  tabLinks.appendChild(newTabBtn);
  
  // Create new tab panel
  let newTabContent = document.createElement("div");
  newTabContent.id = `tab-${tabsCount}`;
  newTabContent.classList.add("tabContent", "activeTabView");

  // Create WYSIWYG parts
  let wysiwygContainer = document.createElement("div")
  wysiwygContainer.classList.add("wysiwyg-container");

  let wysiwygEditor = document.createElement("div")
  wysiwygEditor.classList.add("wysiwyg-editor");
  wysiwygEditor.contentEditable = true;

  wysiwygEditor.addEventListener("input", () => {
    parseActions.parse(wysiwygEditor.innerText);
    let timeout = setTimeout(() => utils.setTextCookie(wysiwygEditor, currentTabIndex), 3000)
    if (timeouts.length == tabsCount) timeouts[currentTabIndex - 1] = timeout
    else timeouts.push(timeout);
  });

  let wysiwygDisplay = document.createElement("div")
  wysiwygDisplay.classList.add("wysiwyg-display");

  wysiwygContainer.appendChild(wysiwygEditor);
  wysiwygContainer.appendChild(wysiwygDisplay);

  // Add new tab panel
  newTabContent.appendChild(wysiwygContainer);
  tabViews.appendChild(newTabContent);

  return wysiwygEditor;
}

/**
 * Change the current tab
 * @param {Number} tabIndex the index of the tab to set
 * as current tab 
 */
function setTab(tabIndex) {
  let activeTabLink = document.getElementsByClassName("activeTab");
  if (activeTabLink.length != 0) {
    activeTabLink[0].classList.remove("activeTab");
    let activeTabView = document.getElementsByClassName("activeTabView");
    activeTabView[0].classList.remove("activeTabView");
  }

  currentTabIndex = tabIndex;

  let tabLinks = document.getElementsByClassName("tablink");
  let tabViews = document.getElementsByClassName("tabContent");

  tabLinks[tabIndex - 1].classList.add("activeTab");
  tabViews[tabIndex - 1].classList.add("activeTabView");
}

/**
 * Delete the given tab
 * @param {Number} tabIndex the index of the tab to delete
 */
function deleteTab(tabIndex) {
  if (tabsCount === 1) return;

  let tabLinks = document.getElementsByClassName("tablink");
  let tabViews = document.getElementsByClassName("tabContent");
  tabLinks[tabIndex - 1].remove();
  tabViews[tabIndex - 1].remove();

  if (tabIndex > 1) setTab(tabIndex - 1);
  if (tabIndex == 1) setTab(2);
  tabsCount--;
}

export {
  addTab,
  deleteTab,
  setTab,
  setNightmode,
  displayAboutThis,
  closeDialog
}