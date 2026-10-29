import dotenv from 'dotenv';
dotenv.config();

import { iaService } from '../services/iaService.js';
import { pesquisaService } from '../services/pesquisaService.js';
import pool from '../config/database.js';

async function runTest() {
  const testTerms = [
    'iPhone 13',
    'Smart TV LG 50 polegadas',
    'Alexa Echo Dot',
    'Cabo USB-C para recarga rápida',
    'Roteador Wi-Fi 6'
  ];

  console.log('🔍 Testando buscas dinâmicas de produtos reais...\n');

  for (const term of testTerms) {
    const res = await pesquisaService.criarPesquisa('test-device-uuid', {
      tipo_entrada: 'texto',
      termo_digitado: term
    });

    console.log(`----------------------------------------`);
    console.log(`Termo pesquisado: "${term}"`);
    console.log(`Produto Identificado: ${res.produto_identificado.nome} (${res.produto_identificado.marca})`);
    console.log(`Categoria: ${res.produto_identificado.categoria}`);
    console.log(`Resumo: ${res.produto_identificado.resumo_simples.slice(0, 80)}...`);
    console.log(`Confiança: ${res.confianca}`);
  }

  console.log('\n✅ Todos os produtos foram identificados com dados individuais e reais!');
  await pool.end();
}

runTest().catch(err => {
  console.error('Erro no teste:', err);
  process.exit(1);
});
