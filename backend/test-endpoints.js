import app from './server.js';
import pool from './config/database.js';

const PORT = 3099; // Porta dedicada para o teste
const BASE_URL = `http://127.0.0.1:${PORT}/api`;
const TEST_DEVICE_ID = 'test-client-uuid-9999';

async function runTests() {
  console.log('🚀 Iniciando testes automatizados dos endpoints do TechLens...');
  const server = app.listen(PORT);

  try {
    // 1. Healthcheck
    console.log('\n[1/10] Testando GET /api/health');
    const resHealth = await fetch(`${BASE_URL}/health`);
    const dataHealth = await resHealth.json();
    console.log('Status:', resHealth.status, '| Resposta:', dataHealth.status);
    if (resHealth.status !== 200) throw new Error('Falha no healthcheck');

    // 2. Registrar Dispositivo
    console.log('\n[2/10] Testando POST /api/dispositivos');
    const resDisp = await fetch(`${BASE_URL}/dispositivos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: TEST_DEVICE_ID })
    });
    const dataDisp = await resDisp.json();
    console.log('Status:', resDisp.status, '| Dispositivo registrado:', dataDisp.dispositivo?.id);
    if (resDisp.status !== 201) throw new Error('Falha ao registrar dispositivo');

    // 3. Registrar Aceite de Privacidade
    console.log('\n[3/10] Testando PATCH /api/dispositivos/privacidade');
    const resPriv = await fetch(`${BASE_URL}/dispositivos/privacidade`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': TEST_DEVICE_ID
      }
    });
    const dataPriv = await resPriv.json();
    console.log('Status:', resPriv.status, '| Aceite registrado em:', dataPriv.dispositivo?.privacidade_aceita_em);
    if (resPriv.status !== 200) throw new Error('Falha ao registrar privacidade');

    // 4. Criar Pesquisa (Identificação por IA)
    console.log('\n[4/10] Testando POST /api/pesquisas');
    const resPesq = await fetch(`${BASE_URL}/pesquisas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': TEST_DEVICE_ID
      },
      body: JSON.stringify({
        tipo_entrada: 'texto',
        termo_digitado: 'fone bluetooth soundmax'
      })
    });
    const dataPesq = await resPesq.json();
    console.log('Status:', resPesq.status, '| Pesquisa ID:', dataPesq.pesquisa_id, '| Confiança:', dataPesq.confianca, '| Identificado:', dataPesq.produto_identificado?.nome);
    if (resPesq.status !== 201) throw new Error('Falha ao criar pesquisa');
    const pesquisaId = dataPesq.pesquisa_id;
    const produtoId = dataPesq.produto_identificado.id;

    // 5. Confirmar Pesquisa
    console.log(`\n[5/10] Testando PATCH /api/pesquisas/${pesquisaId}/confirmar`);
    const resConf = await fetch(`${BASE_URL}/pesquisas/${pesquisaId}/confirmar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': TEST_DEVICE_ID
      },
      body: JSON.stringify({ produto_id: produtoId })
    });
    const dataConf = await resConf.json();
    console.log('Status:', resConf.status, '| Status da pesquisa:', dataConf.pesquisa?.status, '| Produto confirmado:', dataConf.produto?.nome);
    if (resConf.status !== 200) throw new Error('Falha ao confirmar pesquisa');

    // 6. Obter Produto Completo (com especificações, avaliações, comparações e preços)
    console.log(`\n[6/10] Testando GET /api/produtos/${produtoId}`);
    const resProd = await fetch(`${BASE_URL}/produtos/${produtoId}`);
    const dataProd = await resProd.json();
    console.log('Status:', resProd.status, '| Especificações:', dataProd.produto?.especificacoes?.length, '| Lojas encontradas:', dataProd.produto?.precos?.map(p => p.loja).join(', '));
    if (resProd.status !== 200) throw new Error('Falha ao buscar produto completo');

    // 7. Enviar Mensagem no Chat
    console.log(`\n[7/10] Testando POST /api/pesquisas/${pesquisaId}/mensagens`);
    const resChatSend = await fetch(`${BASE_URL}/pesquisas/${pesquisaId}/mensagens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': TEST_DEVICE_ID
      },
      body: JSON.stringify({
        conteudo: 'Tem perigo de choque elétrico se eu colocar o fone no ouvido?'
      })
    });
    const dataChatSend = await resChatSend.json();
    console.log('Status:', resChatSend.status);
    console.log('Usuário perguntou:', dataChatSend.mensagem_usuario?.conteudo);
    console.log('IA respondeu:', dataChatSend.resposta_ia?.conteudo?.slice(0, 80) + '...');
    if (resChatSend.status !== 201) throw new Error('Falha ao enviar mensagem no chat');

    // 8. Listar Mensagens do Chat
    console.log(`\n[8/10] Testando GET /api/pesquisas/${pesquisaId}/mensagens`);
    const resChatList = await fetch(`${BASE_URL}/pesquisas/${pesquisaId}/mensagens`, {
      headers: { 'X-Device-Id': TEST_DEVICE_ID }
    });
    const dataChatList = await resChatList.json();
    console.log('Status:', resChatList.status, '| Total de mensagens no chat:', dataChatList.total);
    if (resChatList.status !== 200 || dataChatList.total < 2) throw new Error('Falha ao listar mensagens');

    // 9. Listar Histórico do Dispositivo
    console.log('\n[9/10] Testando GET /api/pesquisas');
    const resHist = await fetch(`${BASE_URL}/pesquisas`, {
      headers: { 'X-Device-Id': TEST_DEVICE_ID }
    });
    const dataHist = await resHist.json();
    console.log('Status:', resHist.status, '| Total de pesquisas no histórico:', dataHist.total);
    if (resHist.status !== 200 || dataHist.total < 1) throw new Error('Falha ao listar histórico');

    // 10. Apagar Histórico do Dispositivo
    console.log('\n[10/10] Testando DELETE /api/pesquisas');
    const resDel = await fetch(`${BASE_URL}/pesquisas`, {
      method: 'DELETE',
      headers: { 'X-Device-Id': TEST_DEVICE_ID }
    });
    const dataDel = await resDel.json();
    console.log('Status:', resDel.status, '| Registros removidos:', dataDel.registros_removidos);
    if (resDel.status !== 200) throw new Error('Falha ao apagar histórico');

    // Verificar se histórico ficou vazio
    const resHistAfter = await fetch(`${BASE_URL}/pesquisas`, {
      headers: { 'X-Device-Id': TEST_DEVICE_ID }
    });
    const dataHistAfter = await resHistAfter.json();
    console.log('Verificação pós-delete (deve ser 0):', dataHistAfter.total);
    if (dataHistAfter.total !== 0) throw new Error('Histórico não foi esvaziado');

    console.log('\n🎉 TODOS OS 10 TESTES DE ENDPOINTS PASSARAM COM SUCESSO!');
  } finally {
    server.close();
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('\n❌ Erro durante a execução dos testes:', err);
  process.exit(1);
});

