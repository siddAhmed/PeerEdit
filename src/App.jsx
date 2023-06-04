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

// Need to include parsers explicitly for browswer based prettier
// https://prettier.io/docs/en/browser.html
import prettier from "prettier/standalone";
import parserBabel from "https://unpkg.com/prettier@latest/esm/parser-babel.mjs";
import parserHtml from "https://unpkg.com/prettier@latest/esm/parser-html.mjs";
import parserMarkdown from "https://unpkg.com/prettier@latest/esm/parser-markdown.mjs";
import parserCss from "https://unpkg.com/prettier@latest/esm/parser-postcss.mjs";
import parserGraphql from "https://unpkg.com/prettier@latest/esm/parser-graphql.mjs";
import parserTypescript from "https://unpkg.com/prettier@latest/esm/parser-typescript.mjs";
import parserYaml from "https://unpkg.com/prettier@latest/esm/parser-yaml.mjs";

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
  "CSS": { parserValue: "css", monacoValue: "css" },
  "SCSS": { parserValue: "scss", monacoValue: "scss" },
  "Markdown": { parserValue: "markdown", monacoValue: "markdown" },
  "YAML": { parserValue: "yaml", monacoValue: "yaml" },
  "GraphQL": { parserValue: "graphql", monacoValue: "graphql" },
  "JSON": { parserValue: "json", monacoValue: "json" },
  "TypeScript": { parserValue: "typescript", monacoValue: "typescript" },
};

function App() {
  const [peerId, setPeerId] = useState(undefined);
  const [remotePeerId, setRemotePeerId] = useState(undefined);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [chatText, setChatText] = useState(undefined);
  const [messages, setMessages] = useState([]);
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

    navigator.clipboard.writeText(id);
  };

  // Define a function to handle connecting to a remote peer
  const handleConnectToPeer = (peerId) => {
    let id = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
    });

    // Create a new Peer object with the generated local ID
    let newPeer = new Peer(id);
    setPeerId(newPeer.id);

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
    if (data.type === "text") {
      conn.send(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.data, isFromRemote: false },
      ]);
      // console.log(
      //   "sending message: " + [messages.map((message) => message.text)]
      // );
      setChatText("");
    } else if (data.type === "file") {
      conn.send({
        type: "file",
        data: {
          file: data.data,
          filename: data.data.name,
          filetype: data.data.type,
        },
      });
    }
  };

  // Define a function to handle prettifying the text in the text area
  const handlePrettify = () => {
    let formattedText = prettier.format(editorValue, {
      parser: languages[codeLanguage].parserValue,
      plugins: [
        parserBabel,
        parserHtml,
        parserMarkdown,
        parserCss,
        parserGraphql,
        parserTypescript,
        parserYaml,
      ],
    });
    // Update the text area value with the formatted text
    setEditorValue(formattedText);
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <>
      <nav className="navbar flex">
        <h1 className="heading">
          <span className="heading-standout">P</span>eer
          <span className="heading-standout">E</span>dit
        </h1>
        <a href="https://www.linkedin.com/in/siddahmed/" target="_blank">
          <img src="/linkedin.svg" alt="linkedin" className="logo" />
        </a>
        <a href="https://github.com/siddAhmed/PeerEdit" target="_blank">
          <img src="/github.svg" alt="github" className="logo" />
        </a>
      </nav>
      <div className="container flex">
        <div className="content flex">
          <div className="hero">
            <section className="id-management">
              <div className="connection-container flex">
                <div className="peer-connection flex">
                  <a
                    id="create-id"
                    className="btn"
                    onClick={handleCreateId}
                    style={
                      peerId
                        ? { pointerEvents: "none" }
                        : { pointerEvents: "auto" }
                    }
                  >
                    Create ID
                  </a>
                  <div>OR</div>
                  <div className="remote-inp-container flex">
                    <label style={{ display: "block" }} htmlFor="id-input">
                      Enter remote peer's ID
                    </label>
                    <div className="remote-peer-inp-container flex">
                      <input
                        type="text"
                        id="id-input"
                        onInput={(e) => {
                          setRemotePeerId(e.target.value);
                        }}
                        onKeyUp={(e) => {
                          console.log(e.key);
                          if (e.key === "Enter") {
                            handleConnectToPeer(e.target.value);
                          }
                        }}
                        // disable input if peerId is not a null string i.e. already set
                        disabled={peerId ? true : false}
                      />
                      <img
                        src="/ok-button.svg"
                        alt="ok"
                        onClick={
                          () => {
                            handleConnectToPeer(remotePeerId);
                          }
                        }

                      />
                    </div>
                  </div>
                </div>

                <div className="peer-id-display">
                  <div id="id-disp-title">Peer IDs</div>

                  <div className="local-peer-display flex">
                    <div className="local-peer-label peer-label">Local Peer: </div>
                    <div
                      className="peer-id local-peer-id"
                      onClick={() => {
                        navigator.clipboard.writeText(peerId);
                      }}
                    >
                      {peerId ? peerId : <i>Waiting for connection...</i>}
                    </div>
                  </div>

                  <div className="remote-peer-display flex">
                    <div className="remote-peer-label peer-label">Remote Peer:</div>
                    <div
                      className="peer-id remote-peer-id"
                      onClick={() => {
                        navigator.clipboard.writeText(conn ? conn.peer : "");
                      }}
                    >
                      {conn ? conn.peer : <i>Waiting for connection...</i>}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Editor
              className="editor"
              language={languages[codeLanguage].monacoValue}
              value={editorValue}
              theme="vs-dark"
              // debounce function
              onChange={debounce(handleEditorChange, 250)}
            />
            <div className="text-options">
              <select
                className="language-dropdown col"
                onChange={(e) => {
                  if (!(e.target.value === "")) {
                    setCodeLanguage(e.target.value);
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
              <label htmlFor="file-picker" className="custom-file-upload col">
                Upload File
              </label>
              <input
                type="file"
                id="file-picker"
                className="col"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <a
                className="btn send-file col"
                onClick={() => {
                  handleDataTransfer({ type: "file", data: fileState });
                }}
              >
                Send File
              </a>
              <a
                className="btn send-code col"
                onClick={() =>
                  handleDataTransfer({ type: "code", data: editorValue })
                }
              >
                Send Code
              </a>
            </div>
          </div>
          <div className="chat">
            <div id="chat-history">
              <h2 id="msg-history">Message History</h2>
              {messages.map((messageObj, index) => (
                <p
                  className="message"
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
            <input
              className="chat-input"
              placeholder={chatText ? "" : "Type your message here..."}
              disabled={conn ? false : true}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              // catch enter key press and send element to handleDataTransfer
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  setChatText(e.target.value);
                  handleDataTransfer({ type: "text", data: chatText });
                }
              }}
              spellCheck="true"
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
