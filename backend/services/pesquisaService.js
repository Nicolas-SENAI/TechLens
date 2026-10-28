import { pesquisaRepository } from '../repositories/pesquisaRepository.js';
import { dispositivoService } from './dispositivoService.js';
import { produtoService } from './produtoService.js';
import { iaService } from './iaService.js';

export const pesquisaService = {
  async criarPesquisa(dispositivoId, { tipo_entrada, termo_digitado, foto }) {
    if (!dispositivoId) {
      const err = new Error('Identificador do dispositivo não informado.');
      err.status = 400;
      throw err;
    }

    if (!tipo_entrada || !['foto', 'texto'].includes(tipo_entrada)) {
      const err = new Error('Tipo de entrada inválido. Escolha foto ou texto.');
      err.status = 400;
      throw err;
    }

    // Garante que o dispositivo está registrado
    await dispositivoService.registrarDispositivo(dispositivoId);

    // Regra 2: A foto NÃO é salva no banco nem em disco. É passada ao mock em memória e descartada.
    const resultadoIA = await iaService.identificarProduto({
      tipo_entrada,
      termo_digitado,
      foto
    });

    const produtoIdentificado = resultadoIA.produto;
    const confianca = resultadoIA.confianca; // 'alta', 'media', ou 'baixa' (Regra 5)

    // Cria o registro da pesquisa no banco
    const novaPesquisa = await pesquisaRepository.create({
      dispositivo_id: dispositivoId,
      produto_id: produtoIdentificado ? produtoIdentificado.id : null,
      tipo_entrada,
      termo_digitado: tipo_entrada === 'texto' ? termo_digitado : null,
      confianca,
      status: 'identificado'
    });

    return {
      pesquisa_id: novaPesquisa.id,
      confianca: novaPesquisa.confianca,
      status: novaPesquisa.status,
      produto_identificado: produtoIdentificado,
      alternativas: resultadoIA.alternativas
    };
  },

  async confirmarPesquisa(pesquisaId, dispositivoId, produtoId) {
    const pesquisa = await pesquisaRepository.findById(pesquisaId);
    if (!pesquisa) {
      const err = new Error('Pesquisa não encontrada.');
      err.status = 404;
      throw err;
    }

    if (pesquisa.dispositivo_id !== dispositivoId) {
      const err = new Error('Acesso não autorizado para esta pesquisa.');
      err.status = 403;
      throw err;
    }

    // Se o usuário selecionou uma alternativa, atualizamos o produto_id
    const targetProdutoId = produtoId ? Number(produtoId) : pesquisa.produto_id;

    const pesquisaAtualizada = await pesquisaRepository.update(pesquisaId, {
      produto_id: targetProdutoId,
      status: 'confirmado'
    });

    // Retorna a pesquisa junto com os dados completos do produto
    const produtoCompleto = await produtoService.obterProdutoCompleto(targetProdutoId);

    return {
      pesquisa: pesquisaAtualizada,
      produto: produtoCompleto
    };
  },

  async obterHistorico(dispositivoId, categoria = null) {
    if (!dispositivoId) {
      const err = new Error('Identificador do dispositivo não informado.');
      err.status = 400;
      throw err;
    }

    const rows = await pesquisaRepository.findByDispositivo(dispositivoId, categoria);
    return rows;
  },

  async apagarHistorico(dispositivoId) {
    if (!dispositivoId) {
      const err = new Error('Identificador do dispositivo não informado.');
      err.status = 400;
      throw err;
    }

    const removidos = await pesquisaRepository.deleteAllByDispositivo(dispositivoId);
    return {
      sucesso: true,
      mensagem: 'Histórico de pesquisas e mensagens apagado com sucesso.',
      registros_removidos: removidos
    };
  }
};
