import React, { useState } from "react";
import "./index.css";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";

function App() {
  const [peerId, setPeerId] = useState(undefined);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [connStatus, setConnStatus] = useState("idle");
  const [chatText, setChatText] = useState("Type your message here...");
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState(null);
  const [editorValue, setEditorValue] = useState(
    `function HelloWorld() {console.log('Hello world')};`
  );

  const handleDataTransfer = async (dataObj) => {
    if (dataObj.type === "text") {
      conn.send(dataObj);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: dataObj.data, isFromRemote: false },
      ]);
      // console.log(
      //   "sending message: " + [messages.map((message) => message.text)]
      // );
      setChatText("");
    } else if (dataObj.type === "file") {
      conn.send(dataObj);
    } else if (dataObj.type === "code") {
      conn.send({
        type: "code",
        data: dataObj.data,
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
            files={files}
            setFiles={setFiles}
            setMessages={setMessages}
          />

          <Sidebar
            conn={conn}
            chatText={chatText}
            setChatText={setChatText}
            messages={messages}
            files={files}
            setFiles={setFiles}
            handleDataTransfer={handleDataTransfer}
          />
        </div>
      </div>
    </>
  );
}

export default App;
