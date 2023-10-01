import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
    brand: {
      text: "#f1f4f2",
      background: "#121212",
      primary: "#7cd0c2",
      secondary: "#182430",
      accent: "#37c880",
    },
};

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: colors.brand.background,
        color: colors.brand.text
      },
    }),
  },
  colors,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
