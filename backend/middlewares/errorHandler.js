export function errorHandler(err, req, res, next) {
  console.error('[TechLens Error]:', err);

  const status = err.status || 500;
  
  // Mensagens humanizadas compatíveis com as telas de erro do app (RNF-04)
  let mensagem = err.message || 'Ocorreu uma instabilidade temporária. Tente novamente em alguns instantes.';

  // Tratamento para não vazar detalhes técnicos de conexão SQL ou banco
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    mensagem = 'Não foi possível conectar ao banco de dados no momento. Verifique se o serviço MySQL está ativo.';
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    mensagem = 'A estrutura do banco de dados ainda não foi inicializada. Execute o script schema.sql.';
  }

  res.status(status).json({
    sucesso: false,
    erro: mensagem
  });
}
