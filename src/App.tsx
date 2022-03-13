import { Route, Routes } from "react-router-dom";
import { Main } from "./pages/main/Main";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    // primary: {
    //     main: '#f9e45b',
    // },
    secondary: {
      main: "#00f2ff",
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" />
        <Route path="/*" element={<Main />} />
      </Routes>
    </ThemeProvider>
  );
};
