import './style.css'

// The usage -
import { Peer } from "peerjs";
let inp = document.getElementById("id-input");
let btn = document.getElementById("create-id");
let textInp = document.getElementById("text-input");
let texts = document.getElementById("texts");
console.log(texts)

let peer = null;
let conn = null;

// create a peer with id "teetus"
btn.addEventListener("click", function () {
  peer = new Peer("teetus");

  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);

    peer.on("connection", function (connection) {
      console.log("connection established");
      conn = connection;
      conn.on("data", function (data) {
        console.log(data);
        texts.innerHTML += data + "<br>";
      });
    });
  });

});

// register enter key on inp 
inp.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    peer = new Peer();
    peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);

      // connect to the peer
      console.log("connecting to " + inp.value)
      conn = peer.connect(inp.value);
      console.log(conn)

      // check for connection then send a message
      conn.on("open", function () {
        conn.send('Hello!');

        conn.on("data", function (data) {
          console.log(data);
          texts.innerHTML += data + "<br>";
        });
      });
    });
  }
});

textInp.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    console.log("sending message")
    conn.send(textInp.value);
    textInp.value = "";
  }
});