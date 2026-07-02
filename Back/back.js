
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SENHA = process.env.JWT_SENHA || "senha-secreta";
const PORT = 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

async function cadastrarCliente() {                             // cadastrar cliente no supabase, 
  console.log("Cadastro de clientes!");            
  let nome = prompt(" Digite seu nome: ");
  let cpf = prompt(" Digite seu CPF: ");
  let email = prompt(" Digite o email: ");
  let telefone = prompt(" Digite seu número de telefone: ");
  let dataCadastro = prompt(" Data de cadastro: ");
  let endereco = prompt(" Digite seu endereço: ");
  let senha = prompt(" Digite sua senha: ");

  let saltRounds = 7; // número de rounds para gerar o salt, quanto maior, mais seguro, mas também mais lento
  let senhaCrip = await bcrypt.hash(senha, saltRounds);          // criptografando a senha com bcrypt

  let cadastrarCliente = {
    nome: nome,
    cpf: cpf,
    telefone: telefone,
    endereco: endereco,
    senha: senhaCrip,
  };
  const { data, error } = await supabase
    .from("banco_clientes") // banco clientes
    .insert(cadastrarCliente)
    .select();

  console.log(data);
  console.log(error);
}

function autenticarToken(req, res, next) {                        // autenticar token jwt
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const usuario = jwt.verify(token, JWT_SENHA);
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

app.post("/login", async (req, res) => {
  const cpf = req.body.cpf;
  const senha = req.body.senha;

  if (!cpf || !senha) {
    return res.status(400).json({ erro: "CPF e senha são obrigatórios" });
  }

  const { data, error } = await supabase
    .from("biblioteca_usuario")
    .select("*")
    .eq("cpf", cpf);

  if (error) {
    return res.status(500).json({ erro: "Erro ao consultar o usuário" });
  }

  if (!data || data.length <= 0) {
    return res.status(404).json({ erro: "CPF não encontrado" });
  }

  const usuario = data[0];
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Senha incorreta" });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    },
    JWT_SENHA,
    {
      expiresIn: "1h",
    },
  );

  return res.json({
    mensagem: "Login realizado com sucesso",
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    },
  });
});

app.get("/funcionario", autenticarToken, (req, res) => {
  if (req.usuario.tipo !== "funcionario") {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  return res.json({
    msg: "pagina funcionario",
    usuario: req.usuario,
  });
});

app.get("/cliente", autenticarToken, (req, res) => {
  if (req.usuario.tipo !== "cliente") {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  return res.json({
    msg: "pagina cliente",
    usuario: req.usuario,
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
