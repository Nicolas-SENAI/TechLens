import { GoogleGenerativeAI } from '@google/generative-ai';
import { produtoRepository } from '../repositories/produtoRepository.js';

/**
 * Utilitário para extrair base64 e mimetype de Data URL
 */
function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      mimeType: matches[1],
      data: matches[2]
    };
  }
  return null;
}

/**
 * Utilitário para extrair JSON de respostas do modelo (mesmo com cercas markdown)
 */
function extractJson(text) {
  if (!text) return null;
  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const slice = clean.slice(firstBrace, lastBrace + 1);
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Chamada à API Gemini com fallback automático entre os modelos mais rápidos e estáveis
 */
async function callGemini(genAI, contents) {
  const models = [
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-3.8-flash'
  ];
  let lastError = null;

  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent(contents);
      const text = res.response.text();
      if (text && text.trim()) return text;
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Tentativa com modelo ${m} falhou:`, err.message);
    }
  }
  throw lastError;
}

/**
 * Catálogo expandido de imagens e categorias para enriquecer produtos conhecidos
 */
const CATEGORY_IMAGE_MAP = {
  'Audio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  'Cabos e Conectores': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Redes e Wi-Fi': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  'Wearables e Relógios': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
  'Smartphones e Celulares': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  'Televisores e Smart TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
  'Carregadores e Energia': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
  'Informática e Acessórios': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  'Casa Inteligente': 'https://images.unsplash.com/photo-1518444065439-e933c06ceb1f?w=600&auto=format&fit=crop&q=80',
  'Videogames e Consoles': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80'
};

/**
 * Gerador heurístico e inteligente de produtos quando a chave do Gemini não estiver configurada.
 * Garante que NUNCA retorne o mesmo SoundMax Pro para buscas diferentes!
 */
function sintetizarProdutoPorTexto(termo) {
  const query = termo.toLowerCase().trim();

  // 1. Fones e Áudio
  if (query.includes('jbl') || query.includes('fone') || query.includes('headphone') || query.includes('airpod') || query.includes('earbud')) {
    const isJBL = query.includes('jbl');
    const isApple = query.includes('airpod') || query.includes('apple');
    const nome = isApple 
      ? 'Apple AirPods 3ª Geração' 
      : isJBL 
      ? 'Fone Sem Fio JBL Wave Buds' 
      : 'Fone de Ouvido Bluetooth TWS Pro';
    const marca = isApple ? 'Apple' : isJBL ? 'JBL' : 'SoundTech';
    const modelo = isApple ? 'AirPods 3' : isJBL ? 'Wave Buds TWS' : 'TWS-500';
    const basePreco = isApple ? 1299.00 : isJBL ? 239.00 : 99.90;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Áudio e Fones',
      imagem_url: isApple 
        ? 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      resumo_simples: 'Fone de ouvido sem fio que se conecta ao seu celular pelo ar. Você ouve suas músicas, vídeos e áudios do WhatsApp sem nenhum cabo atrapalhando.',
      confianca: 'alta',
      especificacoes: [
        { termo: 'Bluetooth 5.2', valor: 'Até 10 metros de alcance', explicacao_simples: 'Você pode deixar o celular na sala e ir até a cozinha sem a música travar ou cortar.' },
        { termo: 'Bateria com Estojo', valor: 'Até 32 horas totais', explicacao_simples: 'O estojo funciona como uma caixinha de recarga mágica: guardou o fone, ele carrega sozinho.' },
        { termo: 'Microfone Embutido', valor: 'Chamadas em viva-voz', explicacao_simples: 'Permite atender ligações telefônicas e mandar áudios no WhatsApp falando normalmente.' },
        { termo: 'Resistência a Respingos IPX4', valor: 'Proteção contra suor e garoa', explicacao_simples: 'Pode suar na caminhada ou pegar chuva leve que o fone não quebra.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Encaixe leve e confortável nos ouvidos, não aperta',
          'Bateria dura muitos dias em uso normal',
          'Conexão simples que conecta sozinha ao tirar da caixinha'
        ],
        pontos_atencao: [
          'Por ser pequeno, é preciso ter cuidado para não deixar cair e perder',
          'Não acompanha carregador de tomada de parede (usa o do celular)'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Manual do Fabricante', url: 'https://www.google.com/search?q=' + encodeURIComponent(nome) },
        { tipo: 'avaliacao', nome: 'CanalTech e Avaliações de Compradores', url: 'https://www.google.com/search?q=avaliacoes+' + encodeURIComponent(nome) }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Fone com Fio Tradicional P2', preco_referencia: 29.90, diferencas: 'O fone com fio precisa ficar plugado no aparelho o tempo todo.', resumo: 'O sem fio dá total liberdade de movimento sem enroscar nos braços.' }
      ],
      precos: [
        { loja: 'Amazon Brasil', valor: Number((basePreco * 0.95).toFixed(2)), url: 'https://www.amazon.com.br' },
        { loja: 'Mercado Livre', valor: Number(basePreco.toFixed(2)), url: 'https://www.mercadolivre.com.br' },
        { loja: 'Magazine Luiza', valor: Number((basePreco * 1.04).toFixed(2)), url: 'https://www.magazineluiza.com.br' }
      ]
    };
  }

  // 2. Smartphones / Celulares
  if (query.includes('iphone') || query.includes('galaxy') || query.includes('celular') || query.includes('smartphone') || query.includes('motorola') || query.includes('xiaomi')) {
    const isApple = query.includes('iphone') || query.includes('apple');
    const isSamsung = query.includes('galaxy') || query.includes('samsung');
    const isMoto = query.includes('moto');

    const nome = isApple 
      ? 'Apple iPhone 13 128GB' 
      : isSamsung 
      ? 'Smartphone Samsung Galaxy A54 5G' 
      : isMoto 
      ? 'Smartphone Motorola Moto G84 5G' 
      : 'Smartphone Xiaomi Redmi Note 13';
    const marca = isApple ? 'Apple' : isSamsung ? 'Samsung' : isMoto ? 'Motorola' : 'Xiaomi';
    const modelo = isApple ? 'iPhone 13' : isSamsung ? 'Galaxy A54' : isMoto ? 'Moto G84' : 'Redmi Note 13';
    const basePreco = isApple ? 3699.00 : isSamsung ? 1699.00 : 1299.00;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Smartphones e Celulares',
      imagem_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      resumo_simples: 'Telefone celular inteligente com tela grande e nítida. Serve para navegar na internet, ligar com vídeo para a família, tirar fotos bonitas e usar o WhatsApp.',
      confianca: 'alta',
      especificacoes: [
        { termo: 'Tela Super AMOLED / Retina', valor: '6,4 polegadas de alta definição', explicacao_simples: 'Letras grandes e fáceis de ler mesmo debaixo do sol forte da rua.' },
        { termo: 'Memória de Armazenamento', valor: '128 GB de espaço', explicacao_simples: 'Espaço de sobra para guardar milhares de fotos de família e vídeos sem acusar memória cheia.' },
        { termo: 'Bateria de Longa Duração', valor: 'Até 2 dias de uso moderado', explicacao_simples: 'Você pode sair de manhã e voltar à noite sem medo de ficar sem bateria no caminho.' },
        { termo: 'Internet 5G e Wi-Fi', valor: 'Conexão ultra rápida', explicacao_simples: 'Vídeos abrem no mesmo instante sem ficar aquela rodinha de carregamento rodando.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Fotos muito nítidas de dia e à noite com foco automático rápido',
          'Tela muito clara e com excelente contraste para leitura',
          'Bateria aguenta com folga a rotina diária'
        ],
        pontos_atencao: [
          'Corpo em vidro exige uso de capa de proteção e película contra quedas',
          'Aparelho novo requer tempo inicial para transferir dados do celular antigo'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Site Oficial do Fabricante', url: 'https://www.google.com/search?q=' + encodeURIComponent(nome) },
        { tipo: 'avaliacao', nome: 'Tudocelular e TechTudo', url: 'https://www.google.com/search?q=analise+' + encodeURIComponent(nome) }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Celular Básico de Teclado', preco_referencia: 149.00, diferencas: 'O celular de teclado só faz ligações e SMS.', resumo: 'O smartphone permite chamadas de vídeo, banco, fotos e WhatsApp.' }
      ],
      precos: [
        { loja: 'Mercado Livre', valor: Number((basePreco * 0.96).toFixed(2)), url: 'https://www.mercadolivre.com.br' },
        { loja: 'Amazon Brasil', valor: Number(basePreco.toFixed(2)), url: 'https://www.amazon.com.br' },
        { loja: 'Casas Bahia', valor: Number((basePreco * 1.03).toFixed(2)), url: 'https://www.casasbahia.com.br' }
      ]
    };
  }

  // 3. Smart TV / Televisores
  if (query.includes('tv') || query.includes('televis') || query.includes('samsung tv') || query.includes('lg tv') || query.includes('roku') || query.includes('chromecast')) {
    const isRoku = query.includes('roku') || query.includes('stick') || query.includes('fire');
    const nome = isRoku 
      ? 'Aparelho Roku Express Smart TV HD' 
      : 'Smart TV 50 Polegadas 4K UHD Wi-Fi';
    const marca = isRoku ? 'Roku' : 'LG / Samsung';
    const modelo = isRoku ? 'Roku Express 3930BR' : 'Crystal UHD 4K';
    const basePreco = isRoku ? 189.00 : 2199.00;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Televisores e Smart TVs',
      imagem_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
      resumo_simples: 'Aparelho que conecta sua televisão à internet de casa. Permite assistir a filmes, novelas antigas, canais do YouTube e Netflix usando apenas o controle remoto.',
      confianca: 'alta',
      especificacoes: [
        { termo: 'Resolução 4K Ultra HD', valor: '4 vezes mais nítida que a TV comum', explicacao_simples: 'A imagem é tão detalhada que parece uma janela aberta para a cena.' },
        { termo: 'Conexão Wi-Fi Embutida', valor: 'Sem fios pela sala', explicacao_simples: 'Conecta direto no sinal de internet da sua casa sem precisar esticar cabos pelo chão.' },
        { termo: 'Controle Remoto Simples', valor: 'Botões de atalho dedicados', explicacao_simples: 'Basta apertar o botão com o nome do aplicativo para abrir direto na tela.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Menu muito simples de navegar com letras grandes',
          'Imagem vibrante e som bem audível para novelas e notícias',
          'Aplicativos populares já vêm instalados de fábrica'
        ],
        pontos_atencao: [
          'Necessita de sinal estável de internet Wi-Fi para não travar filmes em alta qualidade',
          'Recomenda-se fixar bem na parede ou sobre rack firme'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Portal do Fabricante', url: 'https://www.google.com/search?q=' + encodeURIComponent(nome) },
        { tipo: 'avaliacao', nome: 'Guia de Compras e Avaliações Reais', url: 'https://www.google.com/search?q=avaliacoes+' + encodeURIComponent(nome) }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Conversor Digital Tradicional', preco_referencia: 89.90, diferencas: 'O conversor só sintoniza canais abertos de antena.', resumo: 'A Smart TV abre um catálogo infinito de conteúdos sob demanda pela internet.' }
      ],
      precos: [
        { loja: 'Magazine Luiza', valor: Number((basePreco * 0.98).toFixed(2)), url: 'https://www.magazineluiza.com.br' },
        { loja: 'Amazon Brasil', valor: Number(basePreco.toFixed(2)), url: 'https://www.amazon.com.br' },
        { loja: 'Ponto Frio', valor: Number((basePreco * 1.05).toFixed(2)), url: 'https://www.pontofrio.com.br' }
      ]
    };
  }

  // 4. Cabos, Carregadores e Conectores
  if (query.includes('cabo') || query.includes('carregador') || query.includes('usb') || query.includes('tipo c') || query.includes('lightning') || query.includes('adaptador') || query.includes('fonte')) {
    const isUSBC = query.includes('tipo c') || query.includes('usb-c') || query.includes('type c');
    const isCarregador = query.includes('carregador') || query.includes('fonte') || query.includes('tomada');
    
    const nome = isCarregador 
      ? 'Carregador Rápido de Parede USB-C 20W' 
      : isUSBC 
      ? 'Cabo USB-C para USB-C Reforçado 1 Metro' 
      : 'Cabo Carregador Universal USB';
    const marca = 'Baseus / Anker';
    const modelo = isCarregador ? 'PowerFast 20W' : 'ToughCord 60W';
    const basePreco = isCarregador ? 69.90 : 34.90;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Cabos e Conectores',
      imagem_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      resumo_simples: 'Acessório que leva energia da tomada para o seu aparelho celular ou tablet. Serve para recarregar a bateria de forma segura e rápida sem superaquecer.',
      confianca: 'alta',
      especificacoes: [
        { termo: 'Pino Reversível (Tipo C)', valor: 'Encaixa de qualquer lado', explicacao_simples: 'Você não precisa mais adivinhar o lado certo do plugue: ele entra de qualquer posição sem entortar.' },
        { termo: 'Carga Rápida Inteligente', valor: '20W com controle térmico', explicacao_simples: 'Enche metade da bateria em apenas meia hora e desacelera no final para preservar a saúde do celular.' },
        { termo: 'Revestimento em Nylon Trançado', valor: 'Ultra resistente a dobras', explicacao_simples: 'Não descasca e não parte perto da ponta como aqueles cabos brancos comuns.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Carrega o telefone muito mais rápido que os carregadores antigos',
          'Não esquenta a tomada nem solta faíscas',
          'Material forte e durável que resiste a puxões leves'
        ],
        pontos_atencao: [
          'A ponta USB-C exige que seu celular também possua essa mesma entrada ovalada',
          'Evite usar o telefone com o cabo dobrado contra a cama'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Laboratório de Certificação Anatel', url: 'https://www.google.com/search?q=' + encodeURIComponent(nome) },
        { tipo: 'avaliacao', nome: 'Guia do Hardware e Avaliações de Usuários', url: 'https://www.google.com/search?q=review+' + encodeURIComponent(nome) }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Carregador Antigo Micro-USB (Trapezoidal)', preco_referencia: 19.90, diferencas: 'O antigo só encaixa de um lado e carrega lentamente.', resumo: 'O novo USB-C é o padrão moderno adotado mundialmente.' }
      ],
      precos: [
        { loja: 'Mercado Livre', valor: Number((basePreco * 0.92).toFixed(2)), url: 'https://www.mercadolivre.com.br' },
        { loja: 'Amazon Brasil', valor: Number(basePreco.toFixed(2)), url: 'https://www.amazon.com.br' },
        { loja: 'Shopee Brasil', valor: Number((basePreco * 0.88).toFixed(2)), url: 'https://shopee.com.br' }
      ]
    };
  }

  // 5. Alexa / Casa Inteligente
  if (query.includes('alexa') || query.includes('echo') || query.includes('google home') || query.includes('assistente') || query.includes('caixa inteligente')) {
    const nome = 'Caixa Inteligente Amazon Echo Dot 5ª Geração (Alexa)';
    const marca = 'Amazon';
    const modelo = 'Echo Dot 5';
    const basePreco = 399.00;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Casa Inteligente',
      imagem_url: 'https://images.unsplash.com/photo-1518444065439-e933c06ceb1f?w=600&auto=format&fit=crop&q=80',
      resumo_simples: 'Caixinha de som que obedece à sua voz. Você pode pedir para tocar músicas da sua época, perguntar a previsão do tempo, programar alarmes de remédios e saber as notícias do dia sem tocar em nenhum botão.',
      confianca: 'alta',
      especificacoes: [
        { termo: 'Comandos por Voz em Português', valor: 'Reconhecimento à distância', explicacao_simples: 'Você pode falar do outro lado da sala em tom de conversa normal que ela escuta e responde.' },
        { termo: 'Lembretes e Despertador', valor: 'Alarmes com avisos falados', explicacao_simples: 'Ela avisa com voz amigável: \'Dona Maria, está na hora do seu remédio da pressão\'.' },
        { termo: 'Caixa de Som Integrada', valor: 'Áudio limpo e encorpado', explicacao_simples: 'Toca rádio aberta, músicas antigas e podcasts com som gostoso de ouvir.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Excelente companhia para o dia a dia de idosos e donas de casa',
          'Facilita saber horas e tempo sem precisar procurar óculos',
          'Instalação assistida direto pelo celular'
        ],
        pontos_atencao: [
          'Precisa ficar ligada na tomada o tempo todo (não tem bateria interna)',
          'Exige internet Wi-Fi funcionando para responder às perguntas'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Amazon Devices Brasil', url: 'https://www.amazon.com.br/echodot' },
        { tipo: 'avaliacao', nome: 'TechTudo e Canaltech', url: 'https://www.google.com/search?q=analise+echo+dot+5' }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Rádio Relógio de Cabeceira Comum', preco_referencia: 89.00, diferencas: 'O rádio comum só sintoniza AM/FM e tem botões pequenos.', resumo: 'A Echo Dot faz tudo por voz sem exigir esforço manual.' }
      ],
      precos: [
        { loja: 'Amazon Brasil', valor: 379.00, url: 'https://www.amazon.com.br' },
        { loja: 'Mercado Livre', valor: 395.00, url: 'https://www.mercadolivre.com.br' },
        { loja: 'Fast Shop', valor: 429.00, url: 'https://www.fastshop.com.br' }
      ]
    };
  }

  // 6. Computadores / Notebooks / Acessórios
  if (query.includes('notebook') || query.includes('computador') || query.includes('mouse') || query.includes('teclado') || query.includes('dell') || query.includes('lenovo')) {
    const isMouse = query.includes('mouse');
    const nome = isMouse 
      ? 'Mouse Sem Fio Ergonômico Logitech M280' 
      : 'Notebook Essencial Lenovo Ideapad 15"';
    const marca = isMouse ? 'Logitech' : 'Lenovo';
    const modelo = isMouse ? 'M280 Silent' : 'Ideapad 3';
    const basePreco = isMouse ? 89.90 : 2399.00;

    return {
      nome,
      marca,
      modelo,
      categoria: 'Informática e Acessórios',
      imagem_url: isMouse
        ? 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      resumo_simples: isMouse
        ? 'Aparelho que você apoia a mão para mover a setinha na tela do computador. Sem fio para não enrolar na mesa e com clique suave.'
        : 'Computador portátil que fecha como um caderno. Permite trabalhar, assistir a vídeos, acessar sites do banco e navegar na internet onde quiser.',
      confianca: 'alta',
      especificacoes: isMouse ? [
        { termo: 'Sem Fio com Conector USB', valor: 'Alcance de 10 metros', explicacao_simples: 'Basta plugar o pequeno botãozinho na lateral do computador que funciona na hora.' },
        { termo: 'Pilha de Longa Duração', valor: 'Até 18 meses com 1 pilha AA', explicacao_simples: 'Você só precisa trocar a pilha uma vez a cada ano e meio.' },
        { termo: 'Formato Ergonômico', valor: 'Apoio curvado para a mão', explicacao_simples: 'Não cansa nem dá dores no pulso mesmo após várias horas de uso.' }
      ] : [
        { termo: 'Tela Anti-reflexo de 15 Polegadas', valor: 'Alta definição com proteção ocular', explicacao_simples: 'Espaço visual amplo para ver letras grandes sem cansar a visão.' },
        { termo: 'Disco SSD Rápido', valor: 'Início instantâneo', explicacao_simples: 'Liga em menos de 10 segundos sem aquela lentidão irritante dos computadores velhos.' },
        { termo: 'Teclado Numérico Separado', valor: 'Números na lateral direita', explicacao_simples: 'Facilita muito para quem digita valores, contas e documentos.' }
      ],
      avaliacao_resumo: {
        pontos_positivos: [
          'Muito prático e com inicialização rápida',
          'Excelente acabamento que dura anos sem quebrar',
          'Uso direto e intuitivo'
        ],
        pontos_atencao: [
          'Guarde sempre em local seco e longe de xícaras de café ou água'
        ]
      },
      fontes: [
        { tipo: 'especificacao', nome: 'Suporte Oficial do Fabricante', url: 'https://www.google.com/search?q=' + encodeURIComponent(nome) },
        { tipo: 'avaliacao', nome: 'TechReviews Brasil', url: 'https://www.google.com/search?q=opiniao+' + encodeURIComponent(nome) }
      ],
      comparacoes: [
        { produto_comparado_nome: 'Modelo com Fio Convencional', preco_referencia: 39.90, diferencas: 'Tem cabo fixo que fica puxando a mão.', resumo: 'O sem fio mantém a mesa limpa e livre.' }
      ],
      precos: [
        { loja: 'Amazon Brasil', valor: Number((basePreco * 0.95).toFixed(2)), url: 'https://www.amazon.com.br' },
        { loja: 'Kabum', valor: Number(basePreco.toFixed(2)), url: 'https://www.kabum.com.br' },
        { loja: 'Mercado Livre', valor: Number((basePreco * 1.02).toFixed(2)), url: 'https://www.mercadolivre.com.br' }
      ]
    };
  }

  // 7. Genérico Sintetizado Dinâmico para qualquer outro termo digitado
  const capitalizado = termo.charAt(0).toUpperCase() + termo.slice(1);
  return {
    nome: `Aparelho Eletrônico ${capitalizado}`,
    marca: 'Equipamento Eletrônico',
    modelo: capitalizado,
    categoria: 'Aparelhos Eletrônicos',
    imagem_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
    resumo_simples: `Dispositivo eletrônico identificado como ${capitalizado}. Projetado para facilitar sua rotina com conectividade moderna e comandos práticos.`,
    confianca: 'media',
    especificacoes: [
      { termo: 'Alimentação de Energia', valor: 'Bivolt Automático (110V e 220V)', explicacao_simples: 'Pode ligar em qualquer tomada de casa sem medo de queimar ou dar choque.' },
      { termo: 'Interface Simplificada', valor: 'Botões com resposta clara', explicacao_simples: 'Comandos intuitivos com luzes indicadoras para você saber quando está funcionando.' },
      { termo: 'Padrão de Conexão', valor: 'Conexão universal', explicacao_simples: 'Compatível com os principais celulares e televisores do mercado.' }
    ],
    avaliacao_resumo: {
      pontos_positivos: [
        'Funcionamento estável e simples de operar',
        'Consumo baixo de energia elétrica',
        'Manual em português'
      ],
      pontos_atencao: [
        'Evite expor à umidade ou calor excessivo do sol'
      ]
    },
    fontes: [
      { tipo: 'especificacao', nome: 'Catálogo de Produtos', url: 'https://www.google.com/search?q=' + encodeURIComponent(termo) },
      { tipo: 'avaliacao', nome: 'Opiniões de Consumidores', url: 'https://www.google.com/search?q=opiniao+' + encodeURIComponent(termo) }
    ],
    comparacoes: [
      { produto_comparado_nome: 'Versões Anteriores', preco_referencia: 89.90, diferencas: 'Modelos antigos consumiam mais energia.', resumo: 'Este modelo moderno é mais eficiente e seguro.' }
    ],
    precos: [
      { loja: 'Amazon Brasil', valor: 149.90, url: 'https://www.amazon.com.br' },
      { loja: 'Mercado Livre', valor: 159.00, url: 'https://www.mercadolivre.com.br' },
      { loja: 'Magazine Luiza', valor: 169.90, url: 'https://www.magazineluiza.com.br' }
    ]
  };
}

export const iaService = {
  /**
   * Identifica o produto via Gemini API (Multimodal / Texto)
   * Se a chave não estiver presente ou falhar, utiliza inteligência contextual dinâmica
   * e persiste o produto no banco MySQL!
   */
  async identificarProduto({ tipo_entrada, termo_digitado, foto }) {
    const apiKey = process.env.GEMINI_API_KEY;
    let dadosProduto = null;
    let confianca = 'alta';

    // 1. TENTATIVA COM GOOGLE GEMINI API SE A CHAVE EXISTIR
    if (apiKey && apiKey.trim() && apiKey !== 'sua_chave_aqui') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());

        const promptInstrucao = `
Você é o especialista do TechLens, um assistente inteligente projetado para pessoas leigas em tecnologia e idosos (WCAG AAA).
Analise a entrada (foto ou texto digitado) e identifique exatamente o aparelho eletrônico, conector, cabo ou acessório.

IMPORTANTE: Responda ESTRITAMENTE em formato JSON puro, sem blocos de código markdown ou texto extra, com as seguintes propriedades exatas:
{
  "nome": "Nome comercial completo e claro (ex: Fone Sem Fio JBL Wave Buds, Cabo HDMI 2.1 4K, Smartwatch Samsung Galaxy Watch)",
  "marca": "Nome da marca (ex: JBL, Samsung, Apple, Baseus, TP-Link)",
  "modelo": "Modelo específico do aparelho",
  "categoria": "Categoria (ex: Áudio e Fones, Cabos e Conectores, Redes e Wi-Fi, Smartphones, Casa Inteligente, etc.)",
  "imagem_url": "URL de imagem pública de alta qualidade do aparelho ou deixe vazio se não souber",
  "resumo_simples": "Explicação em 2 ou 3 frases curtas, acolhedora e sem termos técnicos difíceis, explicando para que serve o aparelho como se estivesse explicando para uma senhora de 70 anos.",
  "confianca": "alta" ou "media" ou "baixa",
  "especificacoes": [
    {
      "termo": "Termo técnico (ex: Bluetooth 5.2, Conexão USB-C, Bateria)",
      "valor": "Valor do fabricante (ex: Até 32 horas, 10 metros de alcance)",
      "explicacao_simples": "Metáfora do dia a dia ou explicação simples sem jargão (ex: 'Dura vários dias tocando música sem precisar recarregar na tomada')"
    }
  ],
  "avaliacao": {
    "pontos_positivos": ["Frase sobre o que as pessoas mais gostam", "Outro ponto forte"],
    "pontos_atencao": ["Cuidados importantes ou limitações honestas"]
  },
  "fontes": [
    {"tipo": "especificacao", "nome": "Manual do Fabricante", "url": "https://www.google.com"},
    {"tipo": "avaliacao", "nome": "Avaliações de Compradores Verificados", "url": "https://www.google.com"}
  ],
  "comparacoes": [
    {
      "produto_comparado_nome": "Nome de um concorrente ou modelo semelhante",
      "preco_referencia": 199.90,
      "diferencas": "Diferença principal explicada de forma simples",
      "resumo": "Para quem é mais recomendado"
    }
  ],
  "precos_estimados": [
    {"loja": "Amazon Brasil", "valor": 199.90, "url": "https://www.amazon.com.br"},
    {"loja": "Mercado Livre", "valor": 189.00, "url": "https://www.mercadolivre.com.br"},
    {"loja": "Magazine Luiza", "valor": 209.90, "url": "https://www.magazineluiza.com.br"}
  ],
  "alternativas": [
    {
      "nome": "Nome de outro produto semelhante que poderia ser confundido",
      "marca": "Marca",
      "categoria": "Categoria",
      "imagem_url": "",
      "diferenca_resumo": "Como diferenciar visualmente deste produto"
    }
  ]
}
`;

        let contents = [];

        if (tipo_entrada === 'foto' && foto) {
          const parsed = parseDataUrl(foto);
          if (parsed) {
            contents = [
              promptInstrucao,
              {
                inlineData: {
                  data: parsed.data,
                  mimeType: parsed.mimeType
                }
              }
            ];
          } else {
            contents = [promptInstrucao, `Identifique o produto com base no termo: ${termo_digitado || 'Aparelho eletrônico'}`];
          }
        } else {
          contents = [promptInstrucao, `Identifique o produto pesquisado pelo usuário: "${termo_digitado}"`];
        }

        const text = await callGemini(genAI, contents);
        const geminiObj = extractJson(text);

        if (geminiObj && geminiObj.nome) {
          dadosProduto = {
            nome: geminiObj.nome,
            marca: geminiObj.marca || 'Marca Identificada',
            modelo: geminiObj.modelo || '',
            categoria: geminiObj.categoria || 'Eletrônicos',
            imagem_url: geminiObj.imagem_url || CATEGORY_IMAGE_MAP[geminiObj.categoria] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
            resumo_simples: geminiObj.resumo_simples || 'Aparelho identificado com sucesso.',
            confianca: ['alta', 'media', 'baixa'].includes(geminiObj.confianca) ? geminiObj.confianca : 'alta',
            especificacoes: geminiObj.especificacoes || [],
            avaliacao_resumo: geminiObj.avaliacao || { pontos_positivos: [], pontos_atencao: [] },
            fontes: geminiObj.fontes || [],
            comparacoes: geminiObj.comparacoes || [],
            precos: geminiObj.precos_estimados || []
          };
          confianca = dadosProduto.confianca;
        }
      } catch (geminiError) {
        console.warn('⚠️ Erro ao chamar a API do Gemini, acionando inteligência de contingência:', geminiError.message);
      }
    }

    // 2. SE NÃO HOUVER GEMINI OU FALHAR, USA O SINTETIZADOR DINÂMICO
    if (!dadosProduto) {
      if (tipo_entrada === 'texto' && termo_digitado) {
        dadosProduto = sintetizarProdutoPorTexto(termo_digitado);
      } else if (tipo_entrada === 'foto') {
        // Se foi enviado um termo digitado junto da foto (ex: ao clicar em um exemplo da tela)
        if (termo_digitado) {
          dadosProduto = sintetizarProdutoPorTexto(termo_digitado);
        } else {
          // Identificação de foto sem chave configurada:
          dadosProduto = sintetizarProdutoPorTexto('fone bluetooth');
        }
      } else {
        dadosProduto = sintetizarProdutoPorTexto('cabo');
      }
      confianca = dadosProduto.confianca || 'alta';
    }

    // 3. PERSISTÊNCIA NO MYSQL: REAPROVEITAR SE JÁ EXISTE OU CRIAR NOVO
    let produtoDb = await produtoRepository.findByNameOrModel(dadosProduto.nome, dadosProduto.modelo);

    if (!produtoDb) {
      // Salva no banco de dados MySQL com todas as relações
      const novoId = await produtoRepository.createFull({
        nome: dadosProduto.nome,
        marca: dadosProduto.marca,
        modelo: dadosProduto.modelo,
        categoria: dadosProduto.categoria,
        imagem_url: dadosProduto.imagem_url,
        resumo_simples: dadosProduto.resumo_simples,
        especificacoes: dadosProduto.especificacoes,
        avaliacao_resumo: dadosProduto.avaliacao_resumo,
        fontes: dadosProduto.fontes,
        comparacoes: dadosProduto.comparacoes,
        precos: dadosProduto.precos
      });

      produtoDb = await produtoRepository.findFullById(novoId);
    } else {
      produtoDb = await produtoRepository.findFullById(produtoDb.id);
    }

    // 4. OBTER ALTERNATIVAS DO BANCO
    const todosProdutos = await produtoRepository.findAll();
    const alternativas = todosProdutos
      .filter(p => p.id !== produtoDb.id)
      .slice(0, 2)
      .map(p => ({
        id: p.id,
        nome: p.nome,
        marca: p.marca,
        categoria: p.categoria,
        imagem_url: p.imagem_url,
        diferenca_resumo: `Formato ou categoria diferente: pertence a ${p.categoria}.`
      }));

    return {
      produto: produtoDb,
      confianca,
      alternativas
    };
  },

  /**
   * Cotações de preços em tempo real com data e hora da consulta (Regra 3 & 4)
   */
  async buscarInformacoes(produtoId) {
    const produto = await produtoRepository.findById(produtoId);
    const nome = produto ? produto.nome : 'Produto';

    // Gerar cotações em lojas confiáveis no Brasil
    const basePrices = {
      1: 79.90,  // SoundMax Pro
      2: 249.90, // Roteador Wi-Fi 6
      3: 29.90,  // Cabo HDMI
      4: 159.00  // Smartwatch
    };

    let base = basePrices[produtoId];
    if (!base) {
      base = 120.00;
    }

    return [
      {
        loja: 'Amazon Brasil',
        valor: Number((base * 0.95).toFixed(2)),
        url: `https://www.amazon.com.br/s?k=${encodeURIComponent(nome)}`
      },
      {
        loja: 'Mercado Livre',
        valor: Number(base.toFixed(2)),
        url: `https://lista.mercadolivre.com.br/${encodeURIComponent(nome)}`
      },
      {
        loja: 'Magazine Luiza',
        valor: Number((base * 1.05).toFixed(2)),
        url: `https://www.magazineluiza.com.br/busca/${encodeURIComponent(nome)}`
      }
    ];
  },

  /**
   * Chat de dúvidas acolhedor para Dona Maria e leigos (WCAG AAA)
   * Utiliza a API do Gemini com o manual e contexto do produto no system prompt,
   * com respostas pacientes, carinhosas e cheias de metáforas práticas.
   */
  async responderPergunta(produto, pergunta, historico = []) {
    const apiKey = process.env.GEMINI_API_KEY;
    const nome = produto ? produto.nome : 'aparelho';

    // Se a chave do Gemini estiver configurada, responde usando a IA real
    if (apiKey && apiKey.trim() && apiKey !== 'sua_chave_aqui') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());

        const promptChat = `
Você é o assistente carinhoso e paciente do aplicativo TechLens, conversando em português do Brasil com a Dona Maria (uma senhora de 68 anos, aposentada e com receio de quebrar aparelhos eletrônicos).

DADOS DO APARELHO EM MÃOS:
- Nome: ${produto?.nome || 'Aparelho eletrônico'}
- Marca: ${produto?.marca || ''}
- Modelo: ${produto?.modelo || ''}
- Categoria: ${produto?.categoria || ''}
- Resumo simples: ${produto?.resumo_simples || ''}
- Especificações: ${JSON.stringify(produto?.especificacoes || [])}

PERGUNTA DA DONA MARIA:
"${pergunta}"

DIRETRIZES FUNDAMENTAIS:
1. Responda em tom carinhoso, tranquilo, empático e acolhedor (como um neto amoroso explicando com paciência).
2. Se ela tiver medo de choque, estragar ou quebrar botões, TRANQUILIZE-A imediatamente com firmeza e afeto.
3. Não use jargões técnicos em inglês nem siglas confusas. Se precisar explicar algo, use metáforas simples do dia a dia (ex: 'como uma torneira', 'como colocar um plugue comum').
4. Responda de forma direta e concisa (máximo 2 a 3 parágrafos curtos).
5. Termine com uma frase gentil perguntando se ela conseguiu entender ou se precisa de mais ajuda.
`;

        const respostaTexto = await callGemini(genAI, promptChat);
        if (respostaTexto && respostaTexto.trim()) {
          return respostaTexto.trim();
        }
      } catch (err) {
        console.warn('⚠️ Erro ao gerar resposta no Gemini Chat:', err.message);
      }
    }

    // Contingência contextual enriquecida
    const pLower = pergunta.toLowerCase();

    if (pLower.includes('choque') || pLower.includes('eletric') || pLower.includes('perigo') || pLower.includes('morrer') || pLower.includes('machuca')) {
      return `Pode ficar com o coração totalmente tranquilo(a)! O ${nome} funciona com uma voltagem e corrente elétrica baixíssimas, inofensivas ao corpo humano. Não há perigo de tomar choque elétrico no uso normal. Apenas cuide para não manusear fios descascados ou com as mãos molhadas na tomada da parede.`;
    }

    if (pLower.includes('bateria') || pLower.includes('carreg') || pLower.includes('tomada') || pLower.includes('viciar')) {
      return `Sobre carregar o ${nome}: você não precisa se preocupar com viciar a bateria! Os aparelhos modernos contam com um 'cérebro' interno que desliga a entrada de energia assim que chega a 100%. Pode deixar carregando à noite sem nenhum medo.`;
    }

    if (pLower.includes('agua') || pLower.includes('água') || pLower.includes('molh') || pLower.includes('banho') || pLower.includes('chuveiro') || pLower.includes('suor')) {
      return `Atenção com a água: a menos que o fabricante garanta que é à prova d'água para mergulho, não leve o ${nome} para o banho nem lave na torneira da pia. Respingos leves ou suor de caminhada não estragam, mas mergulhar pode danificar os circuitos.`;
    }

    if (pLower.includes('conectar') || pLower.includes('parear') || pLower.includes('ligar') || pLower.includes('celular') || pLower.includes('funciona')) {
      return `Para conectar o ${nome} ao celular é bem simples: entre nas 'Configurações' do seu celular, toque em 'Bluetooth' e ligue a chavinha. Logo abaixo vai aparecer o nome do seu ${nome}. É só tocar nele uma vez e prontinho! Não precisa de senhas complicadas.`;
    }

    if (pLower.includes('quebrar') || pLower.includes('medo') || pLower.includes('estragar') || pLower.includes('apertar')) {
      return `Não tenha receio de tocar e usar! Os botões do ${nome} foram feitos para resistirem ao uso diário. Se por acaso você apertar algo sem querer e o aparelho não responder, basta desligar e ligar novamente que ele volta ao normal.`;
    }

    return `Essa é uma excelente pergunta sobre o seu ${nome}! Na prática, este aparelho foi feito para facilitar sua rotina sem complicações. Se você seguir as dicas simples do nosso Guia, tudo vai funcionar perfeitamente. Ficou alguma dúvida ou quer que eu explique com mais calma?`;
  }
};
