import React, { useState } from "react";
import "./index.css";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Chat from "./components/Chat";

function App() {
  const [peerId, setPeerId] = useState(undefined);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [connStatus, setConnStatus] = useState("idle");
  const [chatText, setChatText] = useState("Type your message here...");
  const [messages, setMessages] = useState([]);
  const [fileState, setFile] = useState(null);
  const [editorValue, setEditorValue] = useState(
    `function HelloWorld() {console.log('Hello world')};`
  );

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
    } else if (data.type === "code") {
      conn.send({
        type: "code",
        data: data.data,
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="container flex">
        <div className="content flex">
          <Hero
            setPeer={setPeer}
            peerId={peerId}
            setPeerId={setPeerId}
            remotePeerId={remotePeerId}
            setRemotePeerId={setRemotePeerId}
            connectionObj={conn}
            setConn={setConn}
            connStatus={connStatus}
            setConnStatus={setConnStatus}
            handleDataTransfer={handleDataTransfer}
            editorValue={editorValue}
            setEditorValue={setEditorValue}
            setFile={setFile}
            fileState={fileState}
            setMessages={setMessages}
          />
          <Chat
            conn={conn}
            chatText={chatText}
            setChatText={setChatText}
            messages={messages}
            handleDataTransfer={handleDataTransfer}
          />
        </div>
      </div>
    </>
  );
}

export default App;
