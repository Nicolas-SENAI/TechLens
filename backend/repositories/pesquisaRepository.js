import pool from '../config/database.js';

export const pesquisaRepository = {
  async create({ dispositivo_id, produto_id, tipo_entrada, termo_digitado, confianca, status }) {
    const sql = `
      INSERT INTO pesquisa (dispositivo_id, produto_id, tipo_entrada, termo_digitado, confianca, status, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [
      dispositivo_id,
      produto_id || null,
      tipo_entrada,
      termo_digitado || null,
      confianca || 'alta',
      status || 'identificado'
    ]);
    return this.findById(result.insertId);
  },

  async findById(id) {
    const sql = `
      SELECT p.id, p.dispositivo_id, p.produto_id, p.tipo_entrada, p.termo_digitado, 
             p.confianca, p.status, p.criado_em,
             prod.nome AS produto_nome, prod.marca AS produto_marca, 
             prod.categoria AS produto_categoria, prod.imagem_url AS produto_imagem_url,
             prod.resumo_simples AS produto_resumo_simples
      FROM pesquisa p
      LEFT JOIN produto prod ON p.produto_id = prod.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, { produto_id, status, confianca }) {
    const fields = [];
    const values = [];

    if (produto_id !== undefined) {
      fields.push('produto_id = ?');
      values.push(produto_id);
    }
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }
    if (confianca !== undefined) {
      fields.push('confianca = ?');
      values.push(confianca);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE pesquisa SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async findByDispositivo(dispositivoId, categoria = null) {
    let sql = `
      SELECT p.id, p.dispositivo_id, p.produto_id, p.tipo_entrada, p.termo_digitado, 
             p.confianca, p.status, p.criado_em,
             prod.nome AS produto_nome, prod.marca AS produto_marca, 
             prod.categoria AS produto_categoria, prod.imagem_url AS produto_imagem_url,
             prod.resumo_simples AS produto_resumo_simples
      FROM pesquisa p
      LEFT JOIN produto prod ON p.produto_id = prod.id
      WHERE p.dispositivo_id = ?
    `;
    const params = [dispositivoId];

    if (categoria && categoria !== 'Todos') {
      sql += ' AND prod.categoria = ?';
      params.push(categoria);
    }

    sql += ' ORDER BY p.criado_em DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async deleteAllByDispositivo(dispositivoId) {
    // A exclusão em cascata definida no banco (ON DELETE CASCADE)
    // remove automaticamente todas as mensagens vinculadas em mensagem_chat
    const sql = 'DELETE FROM pesquisa WHERE dispositivo_id = ?';
    const [result] = await pool.execute(sql, [dispositivoId]);
    return result.affectedRows;
  }
};

