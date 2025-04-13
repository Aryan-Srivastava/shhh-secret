import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    primary: "#0066FF",
    secondary: "#00CCFF",
    gradient: "linear-gradient(45deg, #0066FF 0%, #00CCFF 100%)",
  },
  dark: {
    bg: "#1A202C",
    card: "#2D3748",
  },
  light: {
    bg: "#F7FAFC",
    card: "#FFFFFF",
  },
};

const theme = extendTheme({
  config,
  colors,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "dark" ? "dark.bg" : "light.bg",
      },
    }),
  },
  components: {
    Button: {
      variants: {
        gradient: {
          bg: "brand.gradient",
          color: "white",
          _hover: {
            opacity: 0.8,
          },
        },
      },
    },
  },
});

export default theme;
