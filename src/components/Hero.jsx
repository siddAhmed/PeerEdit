import { useState } from "react";
import TextOptions from "./TextOptions";
import IdManagement from "./IdManagaement";

import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";

const Hero = ({
  setPeer,
  peerId,
  setPeerId,
  remotePeerId,
  setRemotePeerId,
  connectionObj,
  setConn,
  connStatus,
  setConnStatus,
  handleDataTransfer,
  editorValue,
  setEditorValue,
  setFile,
  fileState,
  setMessages,
}) => {
  const [codeLanguage, setCodeLanguage] = useState("Javascript (Babel)");

  const languages = {
    "Javascript (Babel)": { parserValue: "babel", monacoValue: "javascript" },
    HTML: { parserValue: "html", monacoValue: "html" },
    CSS: { parserValue: "css", monacoValue: "css" },
    SCSS: { parserValue: "scss", monacoValue: "scss" },
    Markdown: { parserValue: "markdown", monacoValue: "markdown" },
    YAML: { parserValue: "yaml", monacoValue: "yaml" },
    GraphQL: { parserValue: "graphql", monacoValue: "graphql" },
    JSON: { parserValue: "json", monacoValue: "json" },
    TypeScript: { parserValue: "typescript", monacoValue: "typescript" },
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <section className="hero">
      <IdManagement
        setPeer={setPeer}
        setRemotePeerId={setRemotePeerId}
        peerId={peerId}
        setPeerId={setPeerId}
        remotePeerId={remotePeerId}
        connectionObj={connectionObj}
        connStatus={connStatus}
        setConnStatus={setConnStatus}
        setConn={setConn}
        setEditorValue={setEditorValue}
        setMessages={setMessages}
      />
      <Editor
        className="editor"
        language={languages[codeLanguage].monacoValue}
        value={editorValue}
        theme="vs-dark"
        // debounce to limit the number of times the editor value is updated
        // prevents the editor from lagging if the user types too fast
        onChange={debounce(handleEditorChange, 250)}
      />
      <TextOptions
        languages={languages}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        fileState={fileState}
        setFile={setFile}
        handleDataTransfer={handleDataTransfer}
      />
    </section>
  );
};

export default Hero;
