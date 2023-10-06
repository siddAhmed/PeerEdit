// Need to include parsers explicitly for browswer based prettier
// https://prettier.io/docs/en/browser.html
import prettier from "prettier/standalone";
import parserBabel from "https://unpkg.com/prettier@latest/plugins/babel.mjs";
import parserHtml from "https://unpkg.com/prettier@latest/plugins/html.mjs";
import parserMarkdown from "https://unpkg.com/prettier@latest/plugins/markdown.mjs";
import parserCss from "https://unpkg.com/prettier@latest/plugins/postcss.mjs";
import parserGraphql from "https://unpkg.com/prettier@latest/plugins/graphql.mjs";
import parserTypescript from "https://unpkg.com/prettier@latest/plugins/typescript.mjs";
import parserYaml from "https://unpkg.com/prettier@latest/plugins/yaml.mjs";

import { Select, Stack, Button } from "@chakra-ui/react";

const TextOptions = ({
  languages,
  codeLanguage,
  setCodeLanguage,
  editorValue,
  setEditorValue,
  files,
  setFiles,
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
    <Stack
      direction={["column", "row"]}
      spacing="24px"
      className="text-options"
    >
      <Select
        width="auto"
        placeholder="Select Language"
        // bg="brand.primary"
        // color="brand.background"
        border="purple solid 2px"
        color="purple"
        onChange={(e) => {
          if (!(e.target.value === "")) {
            setCodeLanguage(e.target.value);
          }
        }}
      >
        {Object.keys(languages).map((languageObj) => (
          <option key={languageObj} value={languageObj}>
            {languageObj}
          </option>
        ))}
      </Select>
      
      <Button colorScheme="purple" variant="outline" onClick={handlePrettify}>
        Prettify
      </Button>

      <Button
        colorScheme="purple"
        variant="outline"
        onClick={() => handleDataTransfer({ type: "code", data: editorValue })}
      >
        Send Code
      </Button>

    </Stack>
  );
};

export default TextOptions;
