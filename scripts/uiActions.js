import * as parseActions from './parser.js';
import * as utils from './utils.js';
import TabLinkButton from './TabButton.js';

let tabsCount = 1;
let tabLinkButtons = [];
let tabViewsDiv = [];
let currentTabId = 1;
let timeouts = [];

/**
 * Close a dialog corresponding to the id passed as parameter
 * @param {String} dialogID the id of the dialog to close
 */
function closeDialog(dialogID) {
  let dialog = document.getElementById(dialogID);
  if (dialog) {
    dialog.style.display = "none";
    const editor = utils.getCurrentEditor();
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
  
  let nightModeCookieVal = active ? 'yes' : 'no';
  utils.setCookie('nightmode', nightModeCookieVal, 30);
}

/**
 * Add a new tab
 * @returns the editor created in the new tab
 */
function addTab() {
  tabsCount++;
  currentTabId = tabsCount;
  let newTabIndex = tabLinkButtons[tabLinkButtons.length - 1].id + 1;
  let tabLinks = document.getElementsByClassName("tab")[0];
  let tabViews = document.getElementById("tabViews");
  let newTabBtn = document.getElementById("new-tab-btn");
  newTabBtn.remove();

  // De-active current tab
  let activeTabLink = document.getElementsByClassName("activeTab");
  activeTabLink[0].classList.remove("activeTab");
  let activeTabView = document.getElementsByClassName("activeTabView");
  activeTabView[0].classList.remove("activeTabView");

  let newTabLink = document.createElement("button");
  newTabLink.classList.add("tablink","activeTab");
  newTabLink.innerText = newTabIndex;
  newTabLink.onclick = setTab.bind(newTabLink, [newTabLink.innerText]);
  newTabLink.oncontextmenu = (event) => { 
    event.preventDefault();
  }
  newTabLink.onmousedown = (event) => {
    if (event.button == 2) deleteTab(newTabLink.innerText);
  }

  let newTabLinkBtn = new TabLinkButton(newTabIndex, newTabLink);
  tabLinkButtons.push(newTabLinkBtn);

  // Add new tab link
  tabLinks.appendChild(newTabLink);
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
    let timeout = setTimeout(() => utils.setTextCookie(wysiwygEditor, newTabIndex), 3000)
    if (timeouts.length == tabsCount) timeouts[newTabIndex - 1] = timeout
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
 * @param {Number} tabId the id of the tab to set
 * as current tab 
 */
function setTab(tabId) {
  let _tabId = null;

  if (typeof tabId === "string") {
    _tabId = Number(tabId);
  }
  else if (typeof tabId === "object") {
    _tabId = Number(tabId[0]);
  }
  else {
    _tabId = tabId;
  }

  let activeTabLink = document.getElementsByClassName("activeTab");
  if (activeTabLink.length != 0) {
    activeTabLink[0].classList.remove("activeTab");
    let activeTabView = document.getElementsByClassName("activeTabView");
    activeTabView[0].classList.remove("activeTabView");
  }

  const tabLinkButtonIndex = tabLinkButtons.findIndex(btn => btn.id === _tabId);
  const tabViews = document.getElementsByClassName("tabContent");

  tabLinkButtons[tabLinkButtonIndex].htmlElement.classList.add("activeTab");
  tabViews[tabLinkButtonIndex].classList.add("activeTabView");
  currentTabId = tabLinkButtons[tabLinkButtonIndex].id;
}

/**
 * Delete the given tab
 * @param {Number} tabIndex the index of the tab to delete
 */
function deleteTab(tabId) {
  if (tabsCount === 1) return;
  let _tabId = Number(tabId); 
  const isActive = isTabActive(_tabId);

  let indexOfTabLink = tabLinkButtons.findIndex(btn => btn.id === _tabId);
  tabLinkButtons[indexOfTabLink].htmlElement.remove();
  tabLinkButtons.splice(indexOfTabLink, 1);
  let tabViews = document.getElementsByClassName("tabContent");
  tabViews[indexOfTabLink].remove();

  if (isActive) {
    if (indexOfTabLink > 0) setTab(tabLinkButtons[indexOfTabLink - 1].id);
    else setTab(tabLinkButtons[indexOfTabLink].id);
  }

  tabsCount--;
}

/**
 * Check if the tab with the given id is active or not
 * @param {Number} tabId the id of the tab to check for active status
 * @returns true if tab with tabId is active, otherwise false
 */
function isTabActive(tabId) {
  const tabLinkBtn = tabLinkButtons.find(btn => btn.id === tabId);
  return tabLinkBtn.htmlElement.classList.contains("activeTab");
}

export {
  addTab,
  deleteTab,
  setTab,
  setNightmode,
  displayAboutThis,
  closeDialog,
  tabLinkButtons
}