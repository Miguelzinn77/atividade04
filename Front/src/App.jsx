// import "./App.css";
import Login from "./pages/Login";
import Funcionario from "./pages/Funcionario";
import Cliente from "./pages/Cliente";
import RotaProtegida from "../components/RotaProtegida";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/cliente"
          element={
            <RotaProtegida tipoPermitido="cliente">
              <Cliente />
            </RotaProtegida>
          }
        />
        <Route
          path="/funcionario"
          element={
            <RotaProtegida tipoPermitido="funcionario">
              <Funcionario />
            </RotaProtegida>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
