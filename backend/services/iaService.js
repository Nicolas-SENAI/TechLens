import { produtoRepository } from '../repositories/produtoRepository.js';

export const iaService = {
  /**
   * Mock para identificação visual e textual do produto.
   * Futuramente será conectado à API do Google Gemini (Gemini 1.5/2.0 multimodal).
   */
  async identificarProduto({ tipo_entrada, termo_digitado, foto }) {
    const allProducts = await produtoRepository.findAll();
    if (allProducts.length === 0) {
      throw new Error('Nenhum produto cadastrado no catálogo.');
    }

    let produtoIdentificado = allProducts[0]; // SoundMax Pro padrão
    let confianca = 'alta';

    if (tipo_entrada === 'texto' && termo_digitado) {
      const term = termo_digitado.toLowerCase();
      if (term.includes('roteador') || term.includes('wifi') || term.includes('internet') || term.includes('rede')) {
        produtoIdentificado = allProducts.find(p => p.id === 2) || allProducts[0];
      } else if (term.includes('hdmi') || term.includes('cabo') || term.includes('televis') || term.includes('videogame')) {
        produtoIdentificado = allProducts.find(p => p.id === 3) || allProducts[0];
      } else if (term.includes('relogio') || term.includes('smartwatch') || term.includes('pulso') || term.includes('passo') || term.includes('batimento')) {
        produtoIdentificado = allProducts.find(p => p.id === 4) || allProducts[0];
      } else if (term.includes('fone') || term.includes('ouvido') || term.includes('bluetooth') || term.includes('som')) {
        produtoIdentificado = allProducts.find(p => p.id === 1) || allProducts[0];
      } else {
        // Busca textual genérica
        const matches = await produtoRepository.findByNameOrCategory(termo_digitado);
        if (matches.length > 0) {
          produtoIdentificado = matches[0];
          confianca = 'alta';
        } else {
          produtoIdentificado = allProducts[0];
          confianca = 'media';
        }
      }
    } else if (tipo_entrada === 'foto') {
      // Simulação de visão computacional: reconhece o primeiro produto por padrão com alta certeza
      produtoIdentificado = allProducts[0];
      confianca = 'alta';
    }

    // Gerar alternativas semelhantes (outros produtos do catálogo)
    const alternativas = allProducts
      .filter(p => p.id !== produtoIdentificado.id)
      .slice(0, 2)
      .map(p => ({
        id: p.id,
        nome: p.nome,
        marca: p.marca,
        categoria: p.categoria,
        imagem_url: p.imagem_url,
        diferenca_resumo: `Formato ou finalidade diferente: pertence à categoria de ${p.categoria}.`
      }));

    return {
      produto: produtoIdentificado,
      confianca,
      alternativas
    };
  },

  /**
   * Mock para busca de informações de preços e atualizações em tempo real.
   * Regra 3 & 4: Gera cotações nas lojas especificadas com data/hora recente.
   */
  async buscarInformacoes(produtoId) {
    // Tabela de preços base para simulação
    const basePrices = {
      1: 79.90,  // SoundMax Pro
      2: 249.90, // Roteador Wi-Fi 6
      3: 29.90,  // Cabo HDMI
      4: 159.00  // Smartwatch
    };

    const base = basePrices[produtoId] || 99.90;

    return [
      {
        loja: 'TechStore Brasil',
        valor: Number((base * 0.98).toFixed(2)),
        url: `https://techstore.exemplo.com/produto/${produtoId}`
      },
      {
        loja: 'MegaEletro',
        valor: Number((base * 1.05).toFixed(2)),
        url: `https://megaeletro.exemplo.com/produto/${produtoId}`
      },
      {
        loja: 'Lojas Universo',
        valor: Number((base * 1.02).toFixed(2)),
        url: `https://lojasuniverso.exemplo.com/produto/${produtoId}`
      }
    ];
  },

  /**
   * Mock conversacional para responder dúvidas de leigos e idosos.
   * Futuramente usará a API do Gemini com o manual do produto no system prompt.
   */
  async responderPergunta(produto, pergunta, historico = []) {
    const pLower = pergunta.toLowerCase();
    const nome = produto ? produto.nome : 'aparelho';

    if (pLower.includes('choque') || pLower.includes('eletric') || pLower.includes('perigo')) {
      return `Pode ficar tranquilo(a)! O ${nome} opera com voltagem e corrente muito baixas. Não há perigo de choque elétrico no uso normal. Apenas tome o cuidado de não ligar fios descascados ou aparelhos molhados diretamente na tomada de alta voltagem.`;
    }

    if (pLower.includes('bateria') || pLower.includes('carreg') || pLower.includes('tomada')) {
      return `Sobre o carregamento do ${nome}: os aparelhos modernos possuem circuito interno inteligente que interrompe a entrada de energia quando a bateria chega a 100%. Você pode carregar na tomada comum sem risco de estragar a bateria.`;
    }

    if (pLower.includes('agua') || pLower.includes('água') || pLower.includes('molh') || pLower.includes('banho') || pLower.includes('chuveiro')) {
      return `Atenção: a menos que o aparelho tenha certificação à prova d'água específica para mergulho, nunca tome banho nem mergulhe o ${nome}. Respingos leves ou suor não quebram, mas a água de torneira ou pia pode danificar os circuitos internos.`;
    }

    if (pLower.includes('conectar') || pLower.includes('parear') || pLower.includes('ligar') || pLower.includes('celular')) {
      return `Para conectar ao celular: abra as Configurações do telefone, clique em Bluetooth e ative a chavinha. Em seguida, procure na lista de aparelhos o nome do ${nome} e clique nele. Ele vai conectar automaticamente sem pedir senhas complicadas!`;
    }

    if (pLower.includes('quebrar') || pLower.includes('medo') || pLower.includes('estragar')) {
      return `Não tenha receio de usar! Os botões e conexões foram projetados para serem resistentes ao dia a dia. Se algo não responder de imediato, desligar e ligar novamente quase sempre resolve com facilidade.`;
    }

    return `Essa é uma ótima pergunta sobre o ${nome}. Na prática, este aparelho foi feito para facilitar sua rotina sem exigir conhecimentos técnicos avançados. Se você seguir os passos simples indicados no nosso Guia, tudo vai funcionar perfeitamente. Há mais alguma dúvida em que eu possa te ajudar?`;
  }
};
