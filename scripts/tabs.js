let tabsCount = 1;
let currentTabIndex = 1;
let timeouts = [];

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
    parse(wysiwygEditor.innerText);
    let timeout = setTimeout(() => setTextCookie(wysiwygEditor, currentTabIndex), 3000)
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

function deleteTab(tabIndex) {
  console.log(tabIndex)
  if (tabsCount === 1) return;

  let tabLinks = document.getElementsByClassName("tablink");
  let tabViews = document.getElementsByClassName("tabContent");
  tabLinks[tabIndex - 1].remove();
  tabViews[tabIndex - 1].remove();

  if (tabIndex > 1) setTab(tabIndex - 1);
  if (tabIndex == 1) setTab(2);
  tabsCount--;
}