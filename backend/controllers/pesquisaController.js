import { pesquisaService } from '../services/pesquisaService.js';

export const pesquisaController = {
  async criar(req, res, next) {
    try {
      const dispositivoId = req.deviceId;
      const { tipo_entrada, termo_digitado, foto } = req.body;

      const resultado = await pesquisaService.criarPesquisa(dispositivoId, {
        tipo_entrada,
        termo_digitado,
        foto
      });

      return res.status(201).json({
        sucesso: true,
        ...resultado
      });
    } catch (err) {
      next(err);
    }
  },

  async confirmar(req, res, next) {
    try {
      const { id } = req.params;
      const dispositivoId = req.deviceId;
      const { produto_id } = req.body;

      const resultado = await pesquisaService.confirmarPesquisa(Number(id), dispositivoId, produto_id);

      return res.status(200).json({
        sucesso: true,
        ...resultado
      });
    } catch (err) {
      next(err);
    }
  },

  async listarHistorico(req, res, next) {
    try {
      const dispositivoId = req.deviceId;
      const { categoria } = req.query;

      const historico = await pesquisaService.obterHistorico(dispositivoId, categoria);

      return res.status(200).json({
        sucesso: true,
        total: historico.length,
        pesquisas: historico
      });
    } catch (err) {
      next(err);
    }
  },

  async apagarHistorico(req, res, next) {
    try {
      const dispositivoId = req.deviceId;
      const resultado = await pesquisaService.apagarHistorico(dispositivoId);

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }
};
