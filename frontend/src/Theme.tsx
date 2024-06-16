import { PaletteOptions, ThemeProvider, createTheme } from "@mui/material";

const palette: PaletteOptions = {
  primary: {
    light: "#fee0f8",
    main: "#EF07D6",
    dark: "#7800ac",
  },
  secondary: {
    light: "#e2fbf6",
    main: "#81EFD8",
    dark: "#0c805d",
  },
  background: {
    default: "white",
    paper: "white",
  },
};

const theme = createTheme({
  palette,
});

export function AppTheme({ children }: React.PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
