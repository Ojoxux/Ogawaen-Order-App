import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e8f5e9",
      100: "#c8e6c9",
      500: "#4caf50",
      700: "#388e3c",
      900: "#1b5e20",
    },
  },
  fonts: {
    heading: '"Noto Sans JP", sans-serif',
    body: '"Noto Sans JP", sans-serif',
  },
});

export default theme;
