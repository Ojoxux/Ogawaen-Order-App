import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    teaGreen: {
      50: '#f0f9f0',
      100: '#d8ecd7',
      200: '#b8d9b7',
      300: '#93c291',
      400: '#6fa96d',
      500: '#528b50',
      600: '#406f3f',
      700: '#2f522e',
      800: '#1e351e',
      900: '#0d180d',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'teaGreen.50',
        color: 'teaGreen.800',
        fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'teaGreen',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'teaGreen.400',
      },
    },
    Tag: {
      baseStyle: {
        borderRadius: 'full',
      },
    },
  },
});

export default theme;
