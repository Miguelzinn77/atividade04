
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
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

function autenticarToken(req, res, next) {
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

app.get("/teste", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
