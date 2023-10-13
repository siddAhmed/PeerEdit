import { Box, Textarea, Heading } from "@chakra-ui/react";

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
  files,
  setFiles,
  handleDataTransfer,
}) => {
  return (
    <section className="chat flex">
      <div id="chat-history" bg="brand.secondary" className="flex">
        <Heading
          id="msg-history-label"
          color="brand.accent"
          size="lg"
          className="not-selectable"
        >
          Message History
        </Heading>
        <Box
          className="msg-container"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#94C2ED",
              borderRadius: "24px",
            },
          }}
        >
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
        </Box>
      </div>
      <Textarea
        resize={"none"}
        isDisabled={conn ? false : true}
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            if (chatText.trim() !== "") {
              setChatText(e.target.value);
              handleDataTransfer({ type: "text", data: chatText });
            }
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
