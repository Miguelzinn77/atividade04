import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  const Navigate = useNavigate();

  

  return (
    <>
      <h1>entre com login</h1>

      <div className="mb-3 row" />
      <label for="staticEmail" className="col-sm-2 col-form-label" />
        Email
      
      <div className="col-sm-10" />

      <div className="mb-3 row">
        <label for="staticEmail" className="col-sm-2 col-form-label" />
          Senha
        
        <div className="col-sm-10" />
      </div>
    </>
  );
};

export default Login;
