// editor & display are loaded in loading.js

// List of Markdown tags available in this app
const markdownTags = ["#", "##", "###", "####", "#####", "######", "-"]

/**
 * Parse the edited text to find
 * Markdown tags and replace them with
 * HTML tags
 * @param {String} text the text to parse
 */
function parse(text){
  let lines = text.split(/(\n\n|\n)/);
  console.log(lines)
  let newText = "";

  lines.forEach(line => {
    let sub;
    let lineContent = line.split(" ");
    let markdownTag = lineContent[0];

    if (markdownTags.includes(markdownTag)) {
      lineContent.shift();
      sub = lineContent.join(" ");

      switch (markdownTag) {
        case "#":
          newText += "<h1>" + sub + "</h2>";
          break;

        case "##":
          newText += "<h2>" + sub + "</h2>";
          break;

        case "###":
          newText += "<h3>" + sub + "</h3>";
          break;

        case "####":
          newText += "<h4>" + sub + "</h'>";
          break;

        case "#####":
          newText += "<h5>" + sub + "</h5>";
          break;

        case "######":
          newText += "<h6>" + sub + "</h6>";
          break;

        case "-":
          newText += "&nbsp;".repeat(6) + "-" + "&nbsp;".repeat(3) + sub + "<br>"
          break;
      }
    }
    else if (line !== '\n' && line !== '\n\n' && line !== '') {
      newText += line + "<br>";
    }
    else if (line === '\n\n') {
      newText += "<br>";
    }
  });

  copyAsPlainText(newText);
}

/**
 * Copy the HTML text as plain text
 * @param {String} text the text to copy
 */
function copyAsPlainText(text) {
  let activeTabView = document.getElementsByClassName("activeTabView");
  let currentDisplay = activeTabView[0].getElementsByClassName("wysiwyg-display")[0];
  if (currentDisplay) currentDisplay.innerHTML = text;
}

export { parse };