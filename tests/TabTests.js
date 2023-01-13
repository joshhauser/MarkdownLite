import { addTab } from "../scripts/uiActions.js";

function testAddTabs(tabCount) {
  for (let i = 0; i < tabCount; i++) addTab();

  const editors = document.getElementsByClassName("wysiwyg-editor");
  
  for (let i = 0; i < editors.length; i++) editors[i].innerText = i + 1;  
}

export {
  testAddTabs
}