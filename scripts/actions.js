/**
 * Make a file with the text then open a download dialog
 * @param {string} filetype: HTML or MD
 */
function save(filetype) {
  // Remove the dialog
  filetypeDialog.style.display = "none";
  // Get link tag which will be used to open download dialog
  let save = document.getElementById("save");
  let contentType, extension, target;

  if (filetype == "HTML") {
    contentType = "text/html";
    extension = ".html";
    target = display.innerHTML;
  }
  else {
    contentType = "text/plain";
    extension = ".md";
    target = editor.innerText;
  }

  // File creation
  let file = new Blob([target], {type: contentType});
  // Settings for download link
  save.href = URL.createObjectURL(file);
  save.download = "memo" + extension;
  // Open download dialog
  save.click();
  // Reset the download link
  save.href = "#";
}

/**
 * Load a file then put its content in editor div
 */
function load() {
  // Get the file selected by user through file opening dialog
  let file = document.getElementById("fileLoader").files[0];
  // Convert file to stream then put its content in "editor" div
  file.text().then(text => {
    editor.innerText = text;
    parse();
  });  
}