function save(){
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.onreadystatechange = checkRequest;
  xhrRequest.open("POST", "php/save.php");
  xhrRequest.setRequestHeader("Content-Type", "text/html");

  let request = "text=" + display.innerHTML;
  console.log(request);
  xhrRequest.send(request);
}

function checkRequest(){
  if (xhrRequest.readyState == 4 && xhrRequest.status == 200) console.log("It works");
}