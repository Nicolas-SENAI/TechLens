import { chatRepository } from '../repositories/chatRepository.js';
import { pesquisaRepository } from '../repositories/pesquisaRepository.js';
import { produtoRepository } from '../repositories/produtoRepository.js';
import { iaService } from './iaService.js';

export const chatService = {
  async obterMensagens(pesquisaId, dispositivoId) {
    const pesquisa = await pesquisaRepository.findById(pesquisaId);
    if (!pesquisa) {
      const err = new Error('Pesquisa não encontrada.');
      err.status = 404;
      throw err;
    }

    if (pesquisa.dispositivo_id !== dispositivoId) {
      const err = new Error('Acesso não autorizado para esta conversa.');
      err.status = 403;
      throw err;
    }

    const mensagens = await chatRepository.findMessagesByPesquisaId(pesquisaId);
    return mensagens;
  },

  async enviarMensagem(pesquisaId, dispositivoId, conteudo) {
    if (!conteudo || typeof conteudo !== 'string' || !conteudo.trim()) {
      const err = new Error('A mensagem não pode estar vazia.');
      err.status = 400;
      throw err;
    }

    const pesquisa = await pesquisaRepository.findById(pesquisaId);
    if (!pesquisa) {
      const err = new Error('Pesquisa não encontrada.');
      err.status = 404;
      throw err;
    }

    if (pesquisa.dispositivo_id !== dispositivoId) {
      const err = new Error('Acesso não autorizado para esta conversa.');
      err.status = 403;
      throw err;
    }

    // Buscar dados do produto para contexto da IA
    const produto = pesquisa.produto_id 
      ? await produtoRepository.findById(pesquisa.produto_id) 
      : null;

    // Buscar histórico de mensagens anteriores para contexto
    const mensagensAnteriores = await chatRepository.findMessagesByPesquisaId(pesquisaId);

    // 1. Salva a mensagem do usuário
    const msgUsuario = await chatRepository.createMessage({
      pesquisa_id: pesquisaId,
      autor: 'usuario',
      conteudo: conteudo.trim()
    });

    // 2. Gera a resposta da IA via serviço mock
    const respostaTexto = await iaService.responderPergunta(
      produto,
      conteudo.trim(),
      mensagensAnteriores
    );

    // 3. Salva a resposta da IA no banco
    const msgIA = await chatRepository.createMessage({
      pesquisa_id: pesquisaId,
      autor: 'ia',
      conteudo: respostaTexto
    });

    return {
      mensagem_usuario: msgUsuario,
      resposta_ia: msgIA
    };
  }
};
