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

  async findByNameOrModel(nome, modelo = null) {
    if (!nome) return null;
    const trimmedNome = nome.trim().toLowerCase();
    const trimmedModelo = modelo ? modelo.trim().toLowerCase() : trimmedNome;
    const sql = `
      SELECT id, nome, marca, modelo, categoria, imagem_url, resumo_simples
      FROM produto
      WHERE LOWER(nome) = ? 
         OR (modelo IS NOT NULL AND LOWER(modelo) = ?)
         OR LOWER(nome) LIKE ?
      ORDER BY id ASC
      LIMIT 1
    `;
    const [rows] = await pool.execute(sql, [
      trimmedNome,
      trimmedModelo,
      `%${trimmedNome}%`
    ]);
    return rows[0] || null;
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
  },

  /**
   * Persiste um novo produto e todos os seus relacionamentos em uma transação atômica.
   * Usado quando a IA identifica um novo aparelho ainda não catalogado no banco.
   */
  async createFull(data) {
    const {
      nome,
      marca,
      modelo = null,
      categoria,
      imagem_url,
      resumo_simples,
      especificacoes = [],
      avaliacao_resumo = null,
      fontes = [],
      comparacoes = [],
      precos = []
    } = data;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Inserir produto principal
      const [resProd] = await connection.execute(
        `INSERT INTO produto (nome, marca, modelo, categoria, imagem_url, resumo_simples)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nome.slice(0, 255),
          (marca || 'Genérica').slice(0, 100),
          modelo ? modelo.slice(0, 100) : null,
          (categoria || 'Eletrônicos').slice(0, 100),
          imagem_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
          resumo_simples
        ]
      );

      const produtoId = resProd.insertId;

      // 2. Inserir especificações
      for (const spec of especificacoes) {
        if (spec.termo && spec.valor) {
          await connection.execute(
            `INSERT INTO especificacao (produto_id, termo, valor, explicacao_simples)
             VALUES (?, ?, ?, ?)`,
            [
              produtoId,
              spec.termo.slice(0, 100),
              spec.valor.slice(0, 150),
              spec.explicacao_simples || 'Sem detalhes adicionais.'
            ]
          );
        }
      }

      // 3. Inserir resumo de avaliações
      if (avaliacao_resumo) {
        const pos = Array.isArray(avaliacao_resumo.pontos_positivos)
          ? JSON.stringify(avaliacao_resumo.pontos_positivos)
          : String(avaliacao_resumo.pontos_positivos || '[]');

        const ate = Array.isArray(avaliacao_resumo.pontos_atencao)
          ? JSON.stringify(avaliacao_resumo.pontos_atencao)
          : String(avaliacao_resumo.pontos_atencao || '[]');

        await connection.execute(
          `INSERT INTO avaliacao_resumo (produto_id, pontos_positivos, pontos_atencao)
           VALUES (?, ?, ?)`,
          [produtoId, pos, ate]
        );
      }

      // 4. Inserir fontes editoriais / fabricantes
      for (const f of fontes) {
        if (f.nome) {
          const tipoValido = f.tipo === 'especificacao' ? 'especificacao' : 'avaliacao';
          await connection.execute(
            `INSERT INTO fonte (produto_id, tipo, nome, url)
             VALUES (?, ?, ?, ?)`,
            [
              produtoId,
              tipoValido,
              f.nome.slice(0, 150),
              f.url ? f.url.slice(0, 500) : null
            ]
          );
        }
      }

      // 5. Inserir comparações
      for (const c of comparacoes) {
        if (c.produto_comparado_nome) {
          await connection.execute(
            `INSERT INTO comparacao (produto_id, produto_comparado_nome, preco_referencia, diferencas, resumo)
             VALUES (?, ?, ?, ?, ?)`,
            [
              produtoId,
              c.produto_comparado_nome.slice(0, 255),
              c.preco_referencia ? Number(c.preco_referencia) : null,
              c.diferencas || 'Diferenças de design e funcionalidade.',
              c.resumo || 'Alternativa compatível para a mesma finalidade.'
            ]
          );
        }
      }

      // 6. Inserir preços de lojas
      for (const p of precos) {
        if (p.loja && p.valor) {
          await connection.execute(
            `INSERT INTO preco (produto_id, loja, valor, url, consultado_em)
             VALUES (?, ?, ?, ?, NOW())`,
            [
              produtoId,
              p.loja.slice(0, 150),
              Number(p.valor),
              p.url ? p.url.slice(0, 500) : null
            ]
          );
        }
      }

      await connection.commit();
      return produtoId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
