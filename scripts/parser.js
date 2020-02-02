// editor & display are loaded in loading.js

// List of Markdown tags available in this app
const markdownTags = ["#", "##", "###", "####"]

/**
 * Parse the edited text to find
 * Markdown tags and replace them with
 * HTML tags
 */
function parse(){
  let lines = editor.innerText.split("\n");
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
          newText += "<h4>" + sub + "</h5>";
          break;
      }
    }
    else{
      newText += line + "<br>";
    }
    //newText += "<br>";
  });

  copyAsPlainText(newText);
}

/**
 * Copy the HTML text as plain text
 * @param {string} text 
 */
function copyAsPlainText(text){
  display.innerHTML = text;
}