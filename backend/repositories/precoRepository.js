import pool from '../config/database.js';

export const precoRepository = {
  async findByProdutoId(produtoId) {
    const sql = `
      SELECT id, produto_id, loja, valor, url, consultado_em
      FROM preco
      WHERE produto_id = ?
      ORDER BY valor ASC
    `;
    const [rows] = await pool.execute(sql, [produtoId]);
    return rows;
  },

  async findLatestTimestamp(produtoId) {
    const sql = `
      SELECT MAX(consultado_em) AS latest
      FROM preco
      WHERE produto_id = ?
    `;
    const [rows] = await pool.execute(sql, [produtoId]);
    return rows[0]?.latest || null;
  },

  async replacePrecos(produtoId, precosNovos) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Deleta preços anteriores deste produto
      await connection.execute('DELETE FROM preco WHERE produto_id = ?', [produtoId]);

      // Insere novos preços com consultado_em atual
      const insertSql = `
        INSERT INTO preco (produto_id, loja, valor, url, consultado_em)
        VALUES (?, ?, ?, ?, NOW())
      `;
      for (const p of precosNovos) {
        await connection.execute(insertSql, [
          produtoId,
          p.loja,
          p.valor,
          p.url || null
        ]);
      }

      await connection.commit();
      return this.findByProdutoId(produtoId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
