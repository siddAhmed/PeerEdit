import React, { useState } from "react";
import "./index.css";

import { Peer } from "peerjs";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import prettier from "prettier/standalone";
import parserBabel from "https://unpkg.com/prettier@2.8.3/esm/parser-babel.mjs";
import parserHtml from "https://unpkg.com/prettier@2.8.3/esm/parser-html.mjs";

// Define an array of languages for the language dropdown
// const languages = [
//   "flow",
//   "babel",
//   "babel-flow",
//   "babel-ts",
//   "typescript",
//   "acorn",
//   "espree",
//   "meriyah",
//   "css",
//   "less",
//   "scss",
//   "json",
//   "json5",
//   "json-stringify",
//   "graphql",
//   "markdown",
//   "mdx",
//   "vue",
//   "yaml",
//   "glimmer",
//   "html",
//   "angular",
//   "lwc",
// ];

const languages = {
  "Javascript (Babel)": { parserValue: "babel", monacoValue: "javascript" },
  "HTML": { parserValue: "html", monacoValue: "html" },
};


function App() {
  const [peerId, setPeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [chatText, setChatText] = useState("Default text");
  const [messages, setMessages] = useState([{}]);
  const [fileState, setFile] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState("Javascript (Babel)");
  const [editorValue, setEditorValue] = useState(
    `function HelloWorld() {console.log('Hello world')};`
  );
  const styles = {
    localPeerText: {
      backgroundColor: "#86BB71",
    },
    remotePeerText: {
      backgroundColor: "#94C2ED",
    },
  };

  // Define a function to handle connection events
  const handleConnection = (conn, localPeer) => {
    conn.on("data", function (data) {
      if (data.type === "text") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.data, isFromRemote: true },
        ]);
      } else if (data.type === "file") {
        let file = new Blob([data.data.file]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = data.data.filename;
        a.click();
        URL.revokeObjectURL(a.href);
        // console.log(
        //   data.data.filename,
        //   data.data.filetype,
        //   data.data.file
        // );
      } else if (data.type === "code") {
        setEditorValue(data.data);
      }
    });

    if (!localPeer) {
      console.error("Error: peer object is null");
      return;
    }

    // check when the **local** peer is disconneted from the signaling server
    localPeer.on("disconnected", function () {
      console.log(
        "Disconnected from signaling server, attempting to reconnect"
      );
      localPeer.reconnect();
    });

    localPeer.on("error", function (err) {
      console.log(err.type, err);
    });
  };

  // Define a function to handle the "Create ID" button click event
  const handleCreateId = () => {
    let id = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
    });
    setPeerId(id);

    // Create a new Peer object with the generated ID
    let newPeer = new Peer(id);
    setPeer(newPeer);

    // Set up event listeners for the new Peer object
    newPeer.on("connection", function (conn) {
      console.info("connection established with remote peer: " + conn.peer);
      setConn(conn);
      handleConnection(conn, newPeer);
    });
    newPeer.on("open", function (id) {
      console.info("Connected to the PeerServer with local id: " + id);
    });
  };

  // Define a function to handle connecting to a remote peer
  const handleConnectToPeer = (peerId) => {
    let id = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
    });

    // Create a new Peer object with the generated local ID
    let newPeer = new Peer(id);
    setPeer(newPeer);

    // Set up event listeners for the new Peer object
    // open event is fired when the connection to the PeerServer is established
    newPeer.on("open", function (id) {
      console.info("Connected to the PeerServer with local id: " + id);
      console.log("connecting to " + peerId);

      // Connect to the remote peer using the provided peer ID
      let conn = newPeer.connect(peerId);
      conn.on("open", function () {
        setConn(conn);
        handleConnection(conn, newPeer);
        console.info("connection established with remote peer: " + conn.peer);
        conn.send("Hello!");
      });
    });
  };

  const handleDataTransfer = (data) => {
    console.log(`handleDataTransfer has been called with data: ${data.type, data.data}`)
    conn.send(data);
    if (data.type === "code") {
      setEditorValue(""); // clear the text area
    } else if (data.type === "text") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.data, isFromRemote: false },
      ]);
      console.log(
        "sending message: " + [messages.map((message) => message.text)]
      );
      setChatText('')
    } else if (data.type === "file") {
      console.log("sending file" + data.data);
      console.log(typeof data.data);
      conn.send({
        type: "file", data: {
          file: data.data,
          filename: data.data.name,
          filetype: data.data.type,
        }
      });
    }
  };

  // Define a function to handle prettifying the text in the text area
  const handlePrettify = () => {
    let formattedText = prettier.format(editorValue, {
      parser: languages[codeLanguage].parserValue,
      plugins: [parserBabel, parserHtml],
    });
    // Update the text area value with the formatted text
    setEditorValue(formattedText);
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    console.log("value changed: " + value);
  };

  return (
    <>
      {/* <div className="topnav flex">
        <a href="#home" className="active">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
        <a href="#" className="icon">
          <i className="fa fa-bars"></i>
        </a>
      </div> */}
      <div className="container flex">
        <div className="hero">
          <section className="id-management">
            <a id="create-id" className="btn" onClick={handleCreateId}>
              Create ID
            </a>
            <label htmlFor="id-input"> or enter first peer's ID: </label>
            <input
              type="text"
              id="id-input"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleConnectToPeer(e.target.value);
                }
              }}
            />
            <span id="local-peer-id">Your local peer ID: {peerId}</span>
          </section>
          <Editor
            height="80%"
            language={languages[codeLanguage].monacoValue}
            value={editorValue}
            theme="vs-dark"
            // debounce function
            onChange={debounce(handleEditorChange, 250)}
          />
          {/* <textarea
            className="text-area"
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
          ></textarea> */}
          <div className="text-options">
            <select
              className="language-dropdown col"
              onChange={(e) => {
                if (!(e.target.value === "")) {
                  console.log("language changed: " + e.target.value)
                  setCodeLanguage(e.target.value)
                }
              }}
            >
              <option value="">Choose language</option>
              {Object.keys(languages).map((languageObj) => (
                <option key={languageObj} value={languageObj}>
                  {languageObj}
                </option>
              ))}
            </select>
            <a className="btn prettify col" onClick={handlePrettify}>
              Prettify
            </a>
            <input
              type="file"
              id="file-picker"
              className="col"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <a className="btn send-file col" onClick={() => { handleDataTransfer({ type: 'file', data: fileState }) }}>
              Send File
            </a>
            <a
              className="btn send-code col"
              onClick={() => handleDataTransfer({ type: 'code', data: editorValue })}
            >
              Send Code
            </a>
          </div>
        </div>
        <div className="chat">
          <h1>Message History</h1>
          <div id="chat-history">
            {messages.map((messageObj, index) => (
              <p
                key={index}
                style={
                  messageObj.isFromRemote
                    ? styles.remotePeerText
                    : styles.localPeerText
                }
              >
                {messageObj.text}
              </p>
            ))}
          </div>
          <textarea
            className="chat-input"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            // catch enter key press and send element to handleDataTransfer
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                console.log(`enter key pressed, chatText state: ${chatText}`)
                setChatText(e.target.value)
                handleDataTransfer({ type: 'text', data: chatText });
              }
            }}
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default App;
