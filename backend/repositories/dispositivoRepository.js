import pool from '../config/database.js';

export const dispositivoRepository = {
  async findById(id) {
    const sql = 'SELECT id, criado_em, privacidade_aceita_em FROM dispositivo WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async create({ id, privacidade_aceita_em = null }) {
    const sql = `
      INSERT INTO dispositivo (id, criado_em, privacidade_aceita_em)
      VALUES (?, NOW(), ?)
      ON DUPLICATE KEY UPDATE id = id
    `;
    await pool.execute(sql, [id, privacidade_aceita_em]);
    return this.findById(id);
  },

  async updatePrivacy(id) {
    const sql = `
      UPDATE dispositivo 
      SET privacidade_aceita_em = NOW() 
      WHERE id = ?
    `;
    await pool.execute(sql, [id]);
    return this.findById(id);
  }
};

