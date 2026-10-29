import dotenv from 'dotenv';
dotenv.config();

import { iaService } from '../services/iaService.js';
import pool from '../config/database.js';

async function testUserScenarios() {
  console.log('🧪 Iniciando testes dos 3 problemas relatados pelo usuário...\n');

  // Teste 1: AKG N5 HYBRID
  console.log('====================================================');
  console.log('TESTE 1: Fone AKG N5 HYBRID (Verificação de Imagem e Alternativas)');
  console.log('====================================================');
  const t0 = Date.now();
  const resAKG = await iaService.identificarProduto({
    tipo_entrada: 'texto',
    termo_digitado: 'AKG N5 HYBRID'
  });
  console.log(`Tempo: ${Date.now() - t0}ms`);
  console.log(`Produto Identificado: ${resAKG.produto.nome} (${resAKG.produto.marca})`);
  console.log(`Imagem do Produto: ${resAKG.produto.imagem_url}`);
  console.log(`Confiança: ${resAKG.confianca}`);
  console.log(`Total de Alternativas: ${resAKG.alternativas.length} (esperado: 4 a 5)`);
  console.log('\nAlternativas encontradas:');
  resAKG.alternativas.forEach((alt, idx) => {
    console.log(`  ${idx + 1}. [${alt.certeza}% de Certeza] ${alt.nome} (${alt.marca})`);
    console.log(`     Foto: ${alt.imagem_url}`);
    console.log(`     Diferença: ${alt.diferenca_resumo}`);
  });

  // Teste 2: Teclado Machenike K500 B61
  console.log('\n====================================================');
  console.log('TESTE 2: Teclado Machenike K500 B61 (Verificação de Imagem e Alternativas)');
  console.log('====================================================');
  const t1 = Date.now();
  const resTeclado = await iaService.identificarProduto({
    tipo_entrada: 'texto',
    termo_digitado: 'Teclado Machenike K500 B61'
  });
  console.log(`Tempo: ${Date.now() - t1}ms`);
  console.log(`Produto Identificado: ${resTeclado.produto.nome} (${resTeclado.produto.marca})`);
  console.log(`Imagem do Produto: ${resTeclado.produto.imagem_url}`);
  console.log(`Confiança: ${resTeclado.confianca}`);
  console.log(`Total de Alternativas: ${resTeclado.alternativas.length} (esperado: 4 a 5)`);
  console.log('\nAlternativas encontradas:');
  resTeclado.alternativas.forEach((alt, idx) => {
    console.log(`  ${idx + 1}. [${alt.certeza}% de Certeza] ${alt.nome} (${alt.marca})`);
    console.log(`     Foto: ${alt.imagem_url}`);
    console.log(`     Diferença: ${alt.diferenca_resumo}`);
  });

  // Validações
  const akgHasDistinctImage = resAKG.produto.imagem_url && !resAKG.produto.imagem_url.includes('1590658268037');
  const akgHas4to5Alts = resAKG.alternativas.length >= 4 && resAKG.alternativas.length <= 5;
  const tecladoHasImage = resTeclado.produto.imagem_url && resTeclado.produto.imagem_url.startsWith('https://');
  const tecladoHas4to5Alts = resTeclado.alternativas.length >= 4 && resTeclado.alternativas.length <= 5;
  const altsHaveCertainty = resTeclado.alternativas.every(a => typeof a.certeza === 'number' && a.certeza > 0);

  console.log('\n====================================================');
  console.log('RESULTADO FINAL DAS CORREÇÕES:');
  console.log(`1. AKG N5 tem imagem nítida própria (não repetida)? ${akgHasDistinctImage ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`2. Retorna de 4 a 5 modelos parecidos? ${akgHas4to5Alts && tecladoHas4to5Alts ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`3. Mostra a porcentagem de Certeza de cada produto? ${altsHaveCertainty ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`4. Teclado tem imagem válida (sem ícone quebrado)? ${tecladoHasImage ? '✅ SIM' : '❌ NÃO'}`);
  console.log('====================================================');

  await pool.end();
}

testUserScenarios().catch(err => {
  console.error('Erro nos testes:', err);
  process.exit(1);
});
