import { Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";
import "./styles.css";

export const App = () => {
  return (
    <Routes>
      <Route path="/login" />
      <Route path="/*" element={<Main />} />
    </Routes>
  );
}
