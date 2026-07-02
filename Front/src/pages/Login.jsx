import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  const fazerLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha: password }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.erro);
        return;
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("tipo", dados.usuario.tipo);
      setMensagem(dados.mensagem || "Login realizado com sucesso");

      if (dados.usuario.tipo === "funcionario") {
        navigate("/funcionario");
      } else if(dados.usuario.tipo === "cliente") {
        navigate("/cliente");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Não foi possível conectar ao servidor");
    }
  };

  return (
    <>
      <h1 className="text-center">Sistema Financeiro</h1>

      <div className="row justify-content-center">
        <div className="col-5">
          <h3>Login</h3>
          <form className="" onSubmit={fazerLogin}>
            <div className="mb-3">
              <label htmlFor="cpf" className="form-label p-5" /> CPF
              <input
                onChange={(e) => setCpf(e.target.value)}
                type="text"
                className="form-control p-5"
                id="cpf"
                name="cpf"
              />
            </div>
            <div className="col-5">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                id="senha"
                name="senha"
              />
            </div>

            <button type="submit" className="btn btn-primary p-5">
              Entrar
            </button>
          </form>

          {mensagem && <p className="mt-5">{mensagem}</p>}
        </div>
      </div>
    </>
  );
};

export default Login;
