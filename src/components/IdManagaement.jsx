import { Peer } from "peerjs";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const IdManagement = ({
  setPeer,
  peerId,
  setPeerId,
  remotePeerId,
  setRemotePeerId,
  connectionObj,
  setConn,
  setEditorValue,
  setMessages,
}) => {
  // Handle connection events
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

  // Handle connection to the remote peer
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

  // Handle the "Create ID" button click event
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

  return (
    <section className="id-management">
      <div className="connection-container flex">
        <div className="peer-connection flex">
          <a
            id="create-id"
            className="btn"
            onClick={handleCreateId}
            style={
              peerId ? { pointerEvents: "none" } : { pointerEvents: "auto" }
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
                  // set the remote peer id state continusouly as the user types
                  // this is to ensure that the remote peer id is always up to date
                  // and the user can connect to the remote peer by pressing okay button
                  setRemotePeerId(e.target.value);
                }}
                onKeyUp={(e) => {
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
                onClick={() => {
                  handleConnectToPeer(remotePeerId);
                }}
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
                navigator.clipboard.writeText(
                  connectionObj ? connectionObj.peer : ""
                );
              }}
            >
              {connectionObj ? (
                connectionObj.peer
              ) : (
                <i>Waiting for connection...</i>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdManagement;
