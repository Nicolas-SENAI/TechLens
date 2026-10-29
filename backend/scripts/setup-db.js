import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('📦 Inicializando banco de dados TechLens no MySQL...');

  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const databaseName = process.env.DB_NAME || 'techlens';

  // 1. Conexão sem especificar banco para poder criar o schema
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });
  } catch (err) {
    console.error('❌ Não foi possível conectar ao servidor MySQL:', err.message);
    process.exit(1);
  }

  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');

    console.log('1. Executando database/schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✅ Schema criado com sucesso.');

    console.log('2. Executando database/seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('✅ Seed de dados inserido com sucesso.');

    console.log('\n🎉 Banco de dados TechLens configurado e pronto para uso!');
  } catch (err) {
    console.error('❌ Erro durante a configuração do banco:', err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();

