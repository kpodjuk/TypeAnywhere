const wsConnectionAddress = "ws://" + "key.local" + ":81/";
var reconnectTimeout = 3000; // Initial reconnect timeout in milliseconds
var ws;

// add event listeners to all keys
document
  .getElementById("keyboard")
  .querySelectorAll("button")
  .forEach((key) => {
    key.addEventListener("click", () => {
      sendKeyPress(key.innerHTML);
    });
  });

function connect() {
  ws = new WebSocket(wsConnectionAddress);

  ws.onopen = () => {
    console.log("WebSocket connection established!");
    reconnectTimeout = 3000; // Reset timeout on successful connection
  };

  ws.onmessage = (event) => {
    // Handle incoming messages from the server
    console.log("Received message:", event.data);
  };

  ws.onclose = (event) => {
    console.log(
      "WebSocket connection closed. Reason:",
      event.reason,
      event.code
    );
    console.log("Reconnecting in", reconnectTimeout, "milliseconds...");
    setTimeout(connect, reconnectTimeout);
    reconnectTimeout *= 2; // Double the timeout for each retry (exponential backoff)
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    console.log("Reconnecting in", reconnectTimeout, "milliseconds...");
    setTimeout(connect, reconnectTimeout);
    reconnectTimeout *= 2; // Double the timeout for each retry (exponential backoff)
  };
}

connect();

// ------- helper functions
function sendJSON(message) {
  // input : message object
  messageString = JSON.stringify(message);
  // console.log("sendJSON():");
  // console.log(messageString);
  ws.send(messageString);
}

function processWebsocketMessage(message) {
  console.log("Got ws msg!");
  console.log(message);
}

setInterval(updateStatusDot, 300);
function updateStatusDot() {
  // 0	CONNECTING	Socket has been created. The connection is not yet open.
  // 1	OPEN	The connection is open and ready to communicate.
  // 2	CLOSING	The connection is in the process of closing.
  // 3	CLOSED	The connection is closed or couldn't be opened.
  switch (ws.readyState) {
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

      // probably will keep on trying to create new connections, kinda bad
      // setTimeout(function () {
      //   // Try to reconnect
      //   connection = new WebSocket(wsConnectionAddress, wsConnectionName);
      // }, 5000);
      break;
  }
}

function sendKeyPress(key) {
  let answerJson = {
    type: "keyPress",
    keyPressed: key,
  };
  sendJSON(answerJson);
}
