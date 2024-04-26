let wsConnectionAddress = "ws://" + "key.local" + ":81/";
let wsConnectionName = ["arduino"];

var connectionCheckInterval = window.setInterval(function () {
  checkConnection();
}, 1000);

var connection = new WebSocket(wsConnectionAddress, wsConnectionName);

// add event listeners to all keys
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    sendKeyPress(key.innerHTML);
  });
});

connection.onopen = function () {
  // let answerJson = {
  //   connected: true,
  // };
  // sendJSON(answerJson);
};
connection.onerror = function (error) {
  console.log("WebSocket Error ", error);
};
connection.onmessage = function (e) {
  console.log("Message received:" + e.data);
  processWebsocketMessage(e.data);
};
connection.onclose = function () {
  checkConnection();
  console.log("WebSocket connection closed");
};

function sendJSON(message) {
  // input : message object
  messageString = JSON.stringify(message);
  console.log("sendJSON():");
  console.log(messageString);
  connection.send(messageString);
}

function processWebsocketMessage(message) {
  console.log("Got ws msg!");
  console.log(message);
}

function checkConnection() {
  // 0	CONNECTING	Socket has been created. The connection is not yet open.
  // 1	OPEN	The connection is open and ready to communicate.
  // 2	CLOSING	The connection is in the process of closing.
  // 3	CLOSED	The connection is closed or couldn't be opened.
  switch (connection.readyState) {
    case 0:
      document.getElementById("statusDot").style.backgroundColor = "orange";

      break;
    case 1:
      document.getElementById("statusDot").style.backgroundColor = "green";

      break;
    case 2:
      document.getElementById("statusDot").style.backgroundColor = "red";

      break;
    case 3:
      document.getElementById("statusDot").style.backgroundColor = "red";
      setTimeout(function () {
        // Try to reconnect
        connection = new WebSocket(wsConnectionAddress, wsConnectionName);
      }, 5000);
      break;
  }
}

function sendKeyPress(key) {
  let answerJson = {
    keyPressed: key,
  };
  sendJSON(answerJson);
}
