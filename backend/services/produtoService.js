import { produtoRepository } from '../repositories/produtoRepository.js';
import { precoRepository } from '../repositories/precoRepository.js';
import { iaService } from './iaService.js';

export const produtoService = {
  async obterProdutoCompleto(id) {
    const produto = await produtoRepository.findFullById(id);
    if (!produto) {
      const err = new Error('Aparelho ou produto não encontrado.');
      err.status = 404;
      throw err;
    }

    // Regra 3: Verificar se os preços expiraram (mais de 24 horas)
    let precosAtualizados = produto.precos || [];
    const latestTimestamp = await precoRepository.findLatestTimestamp(id);

    const agora = new Date().getTime();
    const VINTE_QUATRO_HORAS_MS = 24 * 60 * 60 * 1000;
    const precosExpirados = !latestTimestamp || (agora - new Date(latestTimestamp).getTime() > VINTE_QUATRO_HORAS_MS);

    if (precosExpirados || precosAtualizados.length === 0) {
      // Buscar novas cotações simuladas pelo mock
      const novosPrecos = await iaService.buscarInformacoes(id);
      precosAtualizados = await precoRepository.replacePrecos(id, novosPrecos);
    }

    return {
      ...produto,
      precos: precosAtualizados
    };
  },

  async listarTodos() {
    return produtoRepository.findAll();
  }
};
