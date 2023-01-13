import { addTab, setTab } from "../scripts/uiActions.js";
import { parse } from "../scripts/parser.js";

/**
 * Create a given number of tabs
 * @param {Number} tabCount the number of tabs to add
 */
function testAddTabs(tabCount) {
  for (let i = 0; i < tabCount; i++) addTab();

  const editors = document.getElementsByClassName("wysiwyg-editor");
  
  for (let i = 0; i < editors.length; i++) {
    editors[i].innerText = `# Test tab ${i + 1}`;
    setTab(i + 1);
    parse(editors[i].innerText);
  }
}

export {
  testAddTabs
}