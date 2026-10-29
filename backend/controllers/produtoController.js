import { produtoService } from '../services/produtoService.js';

export const produtoController = {
  async obter(req, res, next) {
    try {
      const { id } = req.params;
      const produto = await produtoService.obterProdutoCompleto(Number(id));

      return res.status(200).json({
        sucesso: true,
        produto
      });
    } catch (err) {
      next(err);
    }
  },

  async listar(req, res, next) {
    try {
      const produtos = await produtoService.listarTodos();

      return res.status(200).json({
        sucesso: true,
        total: produtos.length,
        produtos
      });
    } catch (err) {
      next(err);
    }
  }
};

