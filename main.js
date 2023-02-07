import './style.css'

import { Peer } from "peerjs";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import prettier from "prettier/standalone";
import parserBabel from "https://unpkg.com/prettier@2.8.3/esm/parser-babel.mjs";
import parserHtml from "https://unpkg.com/prettier@2.8.3/esm/parser-html.mjs";

import {basicSetup, EditorView} from "codemirror"
import {keymap} from "@codemirror/view"

function moveToLine(view) {
  let line = prompt("Which line?")
  if (!/^\d+$/.test(line) || +line <= 0 || +line > view.state.doc.lines)
    return false
  let pos = view.state.doc.line(+line).from
  view.dispatch({selection: {anchor: pos}, userEvent: "select"})
  return true
}

let view = new EditorView({
  doc: "a\nb\nc\n",
  extensions: [
    keymap.of([{key: "Alt-l", run: moveToLine}]),
    basicSetup,
  ]
})

let inp = document.getElementById("id-input");
let btn = document.getElementById("create-id");
let textInp = document.getElementById("text-input");
let texts = document.getElementById("texts");
let fileInp = document.getElementById("file-input");
let localPeerId = document.getElementById("local-peer-id");
let textArea = document.getElementById("text-area");
let sendTextButton = document.getElementById("send-text");
let languageDropDown = document.getElementById("language-dropdown");
let prettifyButton = document.getElementById("prettify");
let form = document.getElementById("text-form");

form.innerHTML = view.dom.innerHTML;

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

// create a local peer with randomly generated id
btn.addEventListener("click", function () {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  }); // big-donkey
  localPeerId.innerText = randomName;
  peer = new Peer(randomName);//, {
  //   host: "siddahmed-super-waddle-x9x66rxxrg6fx7x-9000.preview.app.github.dev", // '206.189.129.113',
  //   port: 443,
  //   path: '/PeerEdit',
  // });

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
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
    }); // big-donkey
    peer = new Peer(randomName);//{
    //   host: "siddahmed-super-waddle-x9x66rxxrg6fx7x-9000.preview.app.github.dev", // 
    //   port: 443,
    //   path: '/PeerEdit',
    // });

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

sendTextButton.addEventListener("click", function (event) {
  console.log("sending message")
  conn.send(textArea.value);
  textArea.value = "";
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

languageDropDown.addEventListener("change", function () {
  if (languageDropDown.value === "") {
    prettifyButton.disabled = true;
  } else {
    prettifyButton.disabled = false;
  }
});

prettifyButton.addEventListener("click", function () {
  const code = textArea.value;
  const language = languageDropDown.value;
  console.log(code, language);
  const formattedCode = prettier.format(code, {
    parser: language, 
    plugins: [parserBabel, parserHtml] 
  });
  textArea.value = formattedCode;
});