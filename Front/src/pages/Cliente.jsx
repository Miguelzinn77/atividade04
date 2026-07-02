import React, { useEffect, useState } from 'react';

const Cliente = () => {
  const [mensagem, setMensagem] = useState('Carregando...');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/cliente', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (resposta) => {
        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.erro || 'Erro ao carregar a página');
        }

        setUsuario(dados.usuario);
        setMensagem(dados.msg);
      })
      .catch((erro) => {
        setMensagem(erro.message);
      });
  }, []);

  return (
    <div>
      <h1>Página de cliente</h1>
      <p>{mensagem}</p>
      {usuario && <p>Bem-vindo, {usuario.nome}</p>}
    </div>
  );
};

export default Cliente;
