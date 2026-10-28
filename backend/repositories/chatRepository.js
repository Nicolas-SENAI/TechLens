import pool from '../config/database.js';

export const chatRepository = {
  async findMessagesByPesquisaId(pesquisaId) {
    const sql = `
      SELECT id, pesquisa_id, autor, conteudo, criado_em
      FROM mensagem_chat
      WHERE pesquisa_id = ?
      ORDER BY criado_em ASC, id ASC
    `;
    const [rows] = await pool.execute(sql, [pesquisaId]);
    return rows;
  },

  async createMessage({ pesquisa_id, autor, conteudo }) {
    const sql = `
      INSERT INTO mensagem_chat (pesquisa_id, autor, conteudo, criado_em)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [pesquisa_id, autor, conteudo]);
    const [rows] = await pool.execute(
      'SELECT id, pesquisa_id, autor, conteudo, criado_em FROM mensagem_chat WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  }
};
