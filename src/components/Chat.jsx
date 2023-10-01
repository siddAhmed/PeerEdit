import { Textarea, Heading } from "@chakra-ui/react";

const styles = {
  localPeerText: {
    backgroundColor: "#86BB71",
    marginLeft: "auto",
    marginRight: "1em",
    borderBottomRightRadius: "0%",
  },
  remotePeerText: {
    backgroundColor: "#94C2ED",
    marginLeft: "1em",
    marginRight: "auto",
    borderBottomLeftRadius: "0%",
  },
};

const Chat = ({
  conn,
  chatText,
  setChatText,
  messages,
  handleDataTransfer,
}) => {
  return (
    <section className="chat">
      <div id="chat-history" bg="brand.secondary" className="flex">
        <Heading id="msg-history-label" color="brand.accent" size="lg">Message History</Heading>
        <div className="msg-container">
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
      </div>
      <Textarea
        isDisabled={conn ? false : true}
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setChatText(e.target.value);
            handleDataTransfer({ type: "text", data: chatText });
          }
        }}
        onClick={(e) => {
          if (e.target.value === "Type your message here...") {
            e.target.value = "";
          }
        }}
        spellCheck="true"
        className="chat-input"
      />
    </section>
  );
};

export default Chat;
