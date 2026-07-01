import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Login from "./pages/Login";
import funcionario from "./pages/Funcionario";
import cliente from "./pages/Cliente";
import RotaProtegida from "../components/RotaProtegida";
import { Navigate, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Olá</h1>
      
<Route>

<Route path="/" element={<Navigate to="/login" replace />} />
<Route path="/cliente" element={<Navigate to="/cliente" replace />} />
<Route path="/fncionario" element={<RotaProtegida tipoPermitido={'funcionario'} />} />
</Route>


    </>
  );
}

export default App;
