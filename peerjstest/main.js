import './style.css'

import { Peer } from "peerjs";
let inp = document.getElementById("id-input");
let btn = document.getElementById("create-id");
let textInp = document.getElementById("text-input");
let texts = document.getElementById("texts");
let fileInp = document.getElementById("file-input");

let peer = null;
let conn = null;

function handleConnection(conn) {
  // Handle incoming data
  conn.on("data", function (data) {
    if (typeof data === "object") {
      const blob = new Blob([data.file]);//, { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = data.filename;
      link.click();
      URL.revokeObjectURL(link.href);

      console.log(data);
      console.log(data.filename, data.filetype, data.file);
    } else if (typeof data === "string") {
      console.log(data);
      texts.innerHTML += data + "<br>";
    }
  });


  // Info logging
  peer.on("disconnected", function () {
    console.log("Disconnected from signaling server, attempting to reconnect");
    peer.reconnect();
  });

  peer.on("error", function (err) {
    console.log(err.type, err);
  });
};
 
// create a peer with id "teetus"
btn.addEventListener("click", function () {
  peer = new Peer("teetus", {
    host: "siddahmed-super-waddle-x9x66rxxrg6fx7x-9000.preview.app.github.dev", // '206.189.129.113',
    port: 443,
    path: '/PeerEdit',
  });

  peer.on("connection", function (connection) {
    console.info("connection established with remote peer: " + connection.peer);
    conn = connection;
    handleConnection(conn);
  });

  peer.on('open', function (id) {
    console.info("Connected to the PeerServer with local id: " + id);
  });

});

// register enter key on inp 
inp.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    peer = new Peer({
      host: "siddahmed-super-waddle-x9x66rxxrg6fx7x-9000.preview.app.github.dev", // 
      port: 443,
      path: '/PeerEdit',
    });

    peer.on('open', function (id) {
      console.info("Connected to the PeerServer with local id: " + id);

      // connect to the remote peer
      console.log("connecting to " + inp.value)
      conn = peer.connect(inp.value);

      // Check if connection is established and ready-to-use.
      conn.on("open", function () {
        console.info("connection established with remote peer: " + conn.peer);
        conn.send('Hello!');

        handleConnection(conn);
      });
    });

  };

});

textInp.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    console.log("sending message")
    conn.send(textInp.value);
    textInp.value = "";
  }
});

fileInp.addEventListener("change", function () {
  console.log("sending file");
  console.log(fileInp.files[0])
  console.log(typeof fileInp.files[0])

  const file = fileInp.files[0]

  conn.send({
    file: file,
    filename: file.name,
    filetype: file.type
  })
});