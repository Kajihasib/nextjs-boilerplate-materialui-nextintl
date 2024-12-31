/**
 * Title: Theme component
 * Description: Description of the component
 * Author: Kaji Hasibur Rahman
 * Date: 2024-10-21
 */
"use client";
import { createTheme } from "@mui/material/styles";
// Define the light theme
export const lightTheme = createTheme({
  typography: {
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  palette: {
    mode: "light",
    background: {
      default: "#fff",
    },
    text: {
      primary: "#000",
    },
    primary: {
      main: "#0735c6",
    },
    secondary: {
      main: "#fff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
      },
    },
  },
});
