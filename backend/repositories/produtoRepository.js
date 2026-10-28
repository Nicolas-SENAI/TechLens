import pool from '../config/database.js';

export const produtoRepository = {
  async findById(id) {
    const sql = `
      SELECT id, nome, marca, modelo, categoria, imagem_url, resumo_simples, criado_em, atualizado_em
      FROM produto 
      WHERE id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findAll() {
    const sql = `
      SELECT id, nome, marca, modelo, categoria, imagem_url, resumo_simples, criado_em, atualizado_em
      FROM produto
      ORDER BY id ASC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findByNameOrCategory(termo) {
    const likeTerm = `%${termo}%`;
    const sql = `
      SELECT id, nome, marca, modelo, categoria, imagem_url, resumo_simples
      FROM produto
      WHERE nome LIKE ? OR marca LIKE ? OR modelo LIKE ? OR categoria LIKE ?
      ORDER BY id ASC
    `;
    const [rows] = await pool.execute(sql, [likeTerm, likeTerm, likeTerm, likeTerm]);
    return rows;
  },

  async findFullById(id) {
    const produto = await this.findById(id);
    if (!produto) return null;

    // Buscar especificações
    const [especificacoes] = await pool.execute(
      'SELECT id, termo, valor, explicacao_simples FROM especificacao WHERE produto_id = ? ORDER BY id ASC',
      [id]
    );

    // Buscar resumo de avaliações
    const [avaliacoes] = await pool.execute(
      'SELECT id, pontos_positivos, pontos_atencao, gerado_em FROM avaliacao_resumo WHERE produto_id = ? ORDER BY id DESC LIMIT 1',
      [id]
    );

    let avaliacao = null;
    if (avaliacoes.length > 0) {
      const raw = avaliacoes[0];
      let pontosPositivos = [];
      let pontosAtencao = [];
      try {
        pontosPositivos = JSON.parse(raw.pontos_positivos);
      } catch {
        pontosPositivos = [raw.pontos_positivos];
      }
      try {
        pontosAtencao = JSON.parse(raw.pontos_atencao);
      } catch {
        pontosAtencao = [raw.pontos_atencao];
      }
      avaliacao = {
        id: raw.id,
        pontos_positivos: pontosPositivos,
        pontos_atencao: pontosAtencao,
        gerado_em: raw.gerado_em
      };
    }

    // Buscar fontes
    const [fontes] = await pool.execute(
      'SELECT id, tipo, nome, url FROM fonte WHERE produto_id = ? ORDER BY id ASC',
      [id]
    );

    // Buscar comparações
    const [comparacoes] = await pool.execute(
      'SELECT id, produto_comparado_nome, preco_referencia, diferencas, resumo FROM comparacao WHERE produto_id = ? ORDER BY id ASC',
      [id]
    );

    // Buscar preços
    const [precos] = await pool.execute(
      'SELECT id, loja, valor, url, consultado_em FROM preco WHERE produto_id = ? ORDER BY valor ASC',
      [id]
    );

    return {
      ...produto,
      especificacoes,
      avaliacao_resumo: avaliacao,
      fontes,
      comparacoes,
      precos
    };
  }
};
