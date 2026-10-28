import { chatService } from '../services/chatService.js';

export const chatController = {
  async listarMensagens(req, res, next) {
    try {
      const { id } = req.params;
      const dispositivoId = req.deviceId;

      const mensagens = await chatService.obterMensagens(Number(id), dispositivoId);

      return res.status(200).json({
        sucesso: true,
        total: mensagens.length,
        mensagens
      });
    } catch (err) {
      next(err);
    }
  },

  async enviarMensagem(req, res, next) {
    try {
      const { id } = req.params;
      const dispositivoId = req.deviceId;
      const { conteudo } = req.body;

      const resultado = await chatService.enviarMensagem(Number(id), dispositivoId, conteudo);

      return res.status(201).json({
        sucesso: true,
        ...resultado
      });
    } catch (err) {
      next(err);
    }
  }
};
