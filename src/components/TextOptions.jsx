
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

const TextOptions = ({
  languages,
	codeLanguage,
  setCodeLanguage,
	editorValue,
	setEditorValue,
	fileState,
  setFile,
  handleDataTransfer,
}) => {
  // Handle prettifying the code in the Editor
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
    // Update the text area value with the formatted code
    setEditorValue(formattedText);
  };

  return (
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
        onClick={() => handleDataTransfer({ type: "code", data: editorValue })}
      >
        Send Code
      </a>
    </div>
  );
};

export default TextOptions;
