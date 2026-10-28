import { Device } from '../types';

export const MOCK_DEVICES: Device[] = [
  {
    id: 'tws-soundmax-pro',
    name: 'Fone de Ouvido Bluetooth TWS Pro',
    popularName: 'Fone sem fio com estojinho de carregar',
    category: 'Áudio',
    brand: 'SoundMax / Universal TWS',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: 'high',
    confidenceScore: 94,
    shortSummary: 'Par de fones que funciona sem fio com o seu celular. Eles vêm dentro de uma caixinha que também serve como bateria portátil para recarregar.',
    safeToUseSummary: 'Super seguro: não dá choque, desliga sozinho quando guardado na caixinha e avisa quando a bateria estiver acabando.',
    simplifiedSpecs: [
      {
        label: 'Duração da Bateria',
        techJargon: '350mAh Li-Po / 5.0V',
        humanExplanation: 'Dura cerca de 5 a 6 horas ouvindo música ou rádio direto. A caixinha recarrega os fones até 3 vezes antes de precisar ir na tomada.',
        iconName: 'BatteryCharging',
        safetyTip: 'Pode carregar no carregador comum de celular sem perigo.'
      },
      {
        label: 'Como Conecta',
        techJargon: 'Bluetooth 5.3 Low Latency',
        humanExplanation: 'Sem nenhum fio! Conecta com o celular pelo ar a até 10 metros de distância (dá para deixar o celular na sala e ir na cozinha).',
        iconName: 'Bluetooth'
      },
      {
        label: 'Resistência a Respingos',
        techJargon: 'Certificação IPX4',
        humanExplanation: 'Aguenta suor de caminhada ou uma garoa leve. ATENÇÃO: Não pode mergulhar na água nem tomar banho com ele.',
        iconName: 'Droplet',
        safetyTip: 'Nunca mergulhe na piscina ou debaixo do chuveiro.'
      },
      {
        label: 'Microfone para Chamadas',
        techJargon: 'Microfone MEMS com ENC',
        humanExplanation: 'Dá para atender ligações do WhatsApp e falar normalmente sem precisar segurar o celular na mão.',
        iconName: 'Mic'
      }
    ],
    howToUseSteps: [
      {
        step: 1,
        title: 'Tire os dois fones da caixinha',
        description: 'Ao retirar da caixinha, uma luzinha azul ou branca vai piscar no fone. Isso significa que ele ligou sozinho.',
        highlightTip: 'Não precisa apertar nada para ligar!'
      },
      {
        step: 2,
        title: 'Abra as Configurações do seu celular',
        description: 'Procure pelo ícone de engrenagem no celular e toque em "Bluetooth". Certifique-se de que a chavinha do Bluetooth está ativada (verde ou azul).',
      },
      {
        step: 3,
        title: 'Toque no nome do fone na lista',
        description: 'Na lista de aparelhos disponíveis, procure por "SoundMax Pro" ou "TWS". Toque nele e confirme em "Parear" ou "Conectar".',
        highlightTip: 'Você só precisa fazer isso uma vez! Da próxima vez ele conecta sozinho.'
      },
      {
        step: 4,
        title: 'Como desligar e guardar',
        description: 'Basta colocar os fones de volta dentro da caixinha e fechar a tampa. Eles desligam sozinhos e começam a carregar.',
      }
    ],
    reviewsSummary: {
      averageRating: 4.6,
      satisfactionRate: 91,
      totalAnalyzed: 840,
      sources: [
        { sourceName: 'TechReviews BR', verdict: 'Excelente custo-benefício e volume bem alto para chamadas.', isEditorial: true },
        { sourceName: 'Fórum do Consumidor', verdict: 'Fácil de parear para quem nunca usou fone sem fio.', isEditorial: true },
        { sourceName: 'Portal ÁudioBrasil', verdict: 'Bateria dura o dia todo de uso moderado.', isEditorial: true }
      ],
      pros: [
        'Encaixa confortável no ouvido sem machucar',
        'Volume nítido e bom para ouvir áudios e vídeos',
        'Caixinha compacta cabe no bolso da calça ou na bolsa'
      ],
      cons: [
        'A caixinha não acompanha fonte de tomada (só o cabinho)',
        'O botão de toque é sensível: se encostar sem querer pode pausar a música'
      ]
    },
    priceData: {
      minPrice: 79.90,
      maxPrice: 129.90,
      lastUpdated: 'Hoje às 18:30 (Horário de Brasília)',
      stores: [
        { storeName: 'Magazine Luiza', price: 79.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Mercado Livre (Lojas Oficiais)', price: 84.50, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Amazon Brasil', price: 89.00, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Casas Bahia', price: 99.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true }
      ]
    },
    alternatives: [
      {
        id: 'airdots-basic',
        name: 'Redmi AirDots 2 / 3',
        category: 'Áudio',
        imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'Muito parecido, mas tem um botão físico que faz "clique" em vez de sensor de toque.'
      },
      {
        id: 'fone-lightning-apple',
        name: 'Fone com Fio Conector Estreito (Lightning)',
        category: 'Áudio',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'Tem fio comprido e o conector encaixa apenas em celulares iPhone antigos.'
      }
    ],
    commonQuestions: [
      {
        question: 'Como sei se a caixinha está carregada?',
        answer: 'A caixinha tem uma luzinha de LED. Quando estiver vermelha piscando, está descarregada. Quando a luz parar de piscar e ficar verde ou vermelha fixa, já está 100% cheia e pode tirar da tomada.'
      },
      {
        question: 'Posso usar um fone de cada vez?',
        answer: 'Sim! Você pode tirar apenas o fone direito (ou o esquerdo) e usar enquanto o outro fica guardado carregando na caixinha.'
      },
      {
        question: 'Tem perigo de dar choque no ouvido?',
        answer: 'Zero perigo! A voltagem da bateria do fone é minúscula (cerca de 3.7 volts), totalmente inofensiva para o corpo humano.'
      }
    ],
    officialSupportPhone: '0800 770 1234 (Ligação Gratuita)'
  },
  {
    id: 'cabo-hdmi-21',
    name: 'Cabo HDMI 2.1 de Alta Velocidade',
    popularName: 'Cabo de TV e Vídeo (HDMI)',
    category: 'Cabos & Conectores',
    brand: 'Padrão HDMI Universal',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: 'high',
    confidenceScore: 98,
    shortSummary: 'Cabo que leva imagem com som de alta qualidade de aparelhos como receptor de canais, videogame ou notebook direto para a televisão.',
    safeToUseSummary: 'Muito seguro e fácil de colocar: a ponta tem um formato tipo trapézio que só encaixa de um lado certo.',
    simplifiedSpecs: [
      {
        label: 'Para que serve',
        techJargon: '48Gbps 4K/8K 120Hz HDR',
        humanExplanation: 'Transmite a imagem mais nítida possível e o som em alta definição ao mesmo tempo por um único cabo.',
        iconName: 'Tv'
      },
      {
        label: 'Onde encaixar',
        techJargon: 'Entrada HDMI ARC / eARC',
        humanExplanation: 'Atrás ou do lado da TV, procure pela entrada retangular com os cantos de baixo chanfrados escrita "HDMI 1" ou "HDMI 2".',
        iconName: 'Plug'
      },
      {
        label: 'Comprimento comum',
        techJargon: '1.5m a 2.0m Blindado',
        humanExplanation: 'Geralmente mede entre 1 metro e meio a 2 metros, ideal para ligar o aparelho que fica na estante até a TV.',
        iconName: 'Ruler'
      }
    ],
    howToUseSteps: [
      {
        step: 1,
        title: 'Verifique a ponta do cabo',
        description: 'Observe que a ponta dourada ou prateada tem uma parte mais larga em cima e duas quinas inclinadas embaixo.',
        highlightTip: 'Se não entrar suavemente, vire de cabeça para baixo e tente com calma.'
      },
      {
        step: 2,
        title: 'Encaixe atrás do seu aparelho e na TV',
        description: 'Conecte uma ponta no seu aparelho (receptor, videogame ou notebook) e a outra ponta em qualquer entrada HDMI da TV.',
      },
      {
        step: 3,
        title: 'Mude a entrada da TV pelo controle',
        description: 'No controle remoto da televisão, aperte a tecla "Input", "Source" ou o desenho de um retângulo com uma setinha.',
        highlightTip: 'Escolha a opção HDMI 1 ou HDMI 2 correspondente à entrada onde você colocou o cabo.'
      }
    ],
    reviewsSummary: {
      averageRating: 4.8,
      satisfactionRate: 96,
      totalAnalyzed: 1200,
      sources: [
        { sourceName: 'Guia do Hardware BR', verdict: 'Cabo de construção robusta com conectores reforçados.', isEditorial: true },
        { sourceName: 'Fórum Áudio e Vídeo', verdict: 'Funciona perfeitamente em qualquer televisor moderno.', isEditorial: true }
      ],
      pros: [
        'Transmite imagem e som juntos sem precisar de vários fios coloridos',
        'Basta plugar para funcionar, não precisa configurar nada no computador',
        'Pontas resistentes que não soltam fácil'
      ],
      cons: [
        'O cabo pode ser um pouco duro para dobrar em espaços muito apertados atrás do painel da TV'
      ]
    },
    priceData: {
      minPrice: 24.90,
      maxPrice: 49.90,
      lastUpdated: 'Hoje às 17:45 (Horário de Brasília)',
      stores: [
        { storeName: 'Mercado Livre', price: 24.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Amazon Brasil', price: 29.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Kalunga', price: 39.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true }
      ]
    },
    alternatives: [
      {
        id: 'cabo-displayport',
        name: 'Cabo DisplayPort',
        category: 'Cabos & Conectores',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'Parece com HDMI, mas tem apenas um cantinho chanfrado e uma travinha de apertar para soltar.'
      },
      {
        id: 'cabo-rca-antigo',
        name: 'Cabo RCA de 3 Pontas Coloridas (Amarelo, Branco, Vermelho)',
        category: 'Cabos & Conectores',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'O cabo antigo de tubão e videocassete com pinos redondos coloridos.'
      }
    ],
    commonQuestions: [
      {
        question: 'Preciso desligar a TV da tomada para colocar o cabo HDMI?',
        answer: 'Por segurança recomendada, é bom desligar a TV pelo controle antes de conectar o cabo, mas não há perigo de choque elétrico.'
      },
      {
        question: 'Meu videogame novo funciona na TV mais antiga com esse cabo?',
        answer: 'Sim! Desde que sua TV tenha a entradinha retangular HDMI, ela vai exibir a imagem normalmente.'
      }
    ],
    officialSupportPhone: '0800 111 4364'
  },
  {
    id: 'carregador-usbc-fast',
    name: 'Carregador Rápido USB-C 67W com Cabo',
    popularName: 'Carregador de tomada moderno (ponta arredondada)',
    category: 'Carregadores & Energia',
    brand: 'Universal Power GaN',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: 'high',
    confidenceScore: 92,
    shortSummary: 'Fonte de tomada moderna que carrega a bateria do celular muito mais rápido e usa o conector novo que entra de qualquer lado.',
    safeToUseSummary: 'Possui chip inteligente que regula a energia: se seu aparelho for mais simples, o carregador manda menos energia para não esquentar nem estragar.',
    simplifiedSpecs: [
      {
        label: 'Tipo de Conector',
        techJargon: 'USB Type-C Reversível',
        humanExplanation: 'A ponta é arredondada e simétrica: entra de qualquer lado, você nunca mais vai errar a posição ao plugar no escuro.',
        iconName: 'Zap'
      },
      {
        label: 'Velocidade de Carga',
        techJargon: 'Tecnologia Power Delivery (PD) 67W GaN',
        humanExplanation: 'Carrega até 50% da bateria de um celular comum em apenas 20 a 30 minutos.',
        iconName: 'Gauge'
      },
      {
        label: 'Pinos de Tomada',
        techJargon: 'Padrão NBR 14136 (2 pinos)',
        humanExplanation: 'Pinos redondos no padrão brasileiro que encaixam direto na tomada da parede sem precisar de benjamim ou adaptador.',
        iconName: 'Power'
      }
    ],
    howToUseSteps: [
      {
        step: 1,
        title: 'Ligue na tomada',
        description: 'Coloque a base quadrada na tomada da parede. Ela não precisa esquentar muito.',
      },
      {
        step: 2,
        title: 'Conecte o cabo no celular',
        description: 'Encaixe a pontinha ovalada no celular. Como os dois lados são iguais, qualquer lado encaixa com suavidade.',
        highlightTip: 'Quando conectar, a tela do celular acenderá mostrando "Carregamento Rápido" ou "Turbo".'
      }
    ],
    reviewsSummary: {
      averageRating: 4.7,
      satisfactionRate: 94,
      totalAnalyzed: 512,
      sources: [
        { sourceName: 'Portal TechConfiável', verdict: 'Não esquenta a tomada graças à tecnologia GaN moderna.', isEditorial: true },
        { sourceName: 'Fórum dos Consumidores', verdict: 'Serve tanto para celulares Samsung e Motorola quanto para iPhones mais novos.', isEditorial: true }
      ],
      pros: [
        'Carrega muito rápido, economizando tempo na correria',
        'Proteção contra sobretensão e curto-circuito na rede elétrica',
        'Serve para quase todos os celulares lançados nos últimos anos'
      ],
      cons: [
        'Não serve em celulares mais antigos com conector trapezoidal (Micro-USB)'
      ]
    },
    priceData: {
      minPrice: 59.90,
      maxPrice: 119.00,
      lastUpdated: 'Hoje às 16:10 (Horário de Brasília)',
      stores: [
        { storeName: 'Amazon Brasil', price: 69.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Shopee Oficial', price: 59.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Americanas', price: 89.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true }
      ]
    },
    alternatives: [
      {
        id: 'carregador-microusb-antigo',
        name: 'Carregador Antigo Micro-USB (Formato de Trapézio)',
        category: 'Carregadores & Energia',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'O conector antigo tem dentes e só entra de um lado. Se forçar do lado errado pode quebrar a entrada do celular.'
      },
      {
        id: 'carregador-iphone-lightning',
        name: 'Carregador com Conector Lightning (iPhone antigo)',
        category: 'Carregadores & Energia',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'A ponta é bem achatada com 8 tracinhos dourados desenhados na lâmina.'
      }
    ],
    commonQuestions: [
      {
        question: 'Se o carregador é muito forte, ele pode estragar a bateria do meu celular?',
        answer: 'Não! O celular possui uma central de controle interna que só "pede" a quantidade de energia que suporta. Você pode usar tranquilamente.'
      },
      {
        question: 'Posso deixar na tomada mesmo depois que o celular já chegou a 100%?',
        answer: 'Sim, o carregador moderno corta a corrente elétrica assim que o celular atinge 100%, apenas mantendo a carga.'
      }
    ],
    officialSupportPhone: '0800 892 2012'
  },
  {
    id: 'adaptador-p2-lightning',
    name: 'Adaptador de Fone P2 (3.5mm) para iPhone',
    popularName: 'Adaptador para fone com fio no celular',
    category: 'Cabos & Conectores',
    brand: 'Compatível Apple Lightning',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: 'medium',
    confidenceScore: 78,
    shortSummary: 'Pequeno cabinho adaptador que permite usar fones de ouvido antigos de pino redondo nos celulares que não possuem mais essa entrada.',
    safeToUseSummary: 'Totalmente passivo e seguro: basta plugar e começar a ouvir.',
    simplifiedSpecs: [
      {
        label: 'Entrada Fêmea (onde liga o fone)',
        techJargon: 'Jack P2 TRRS 3.5mm',
        humanExplanation: 'É o furinho redondo onde encaixa aquele pino tradicional de fones com fio comuns.',
        iconName: 'Headphones'
      },
      {
        label: 'Ponta Macho (onde liga no celular)',
        techJargon: 'Plug Lightning 8 Pinos',
        humanExplanation: 'Ponta retangular fininha com tracinhos dourados que entra na parte inferior do iPhone.',
        iconName: 'Smartphone'
      }
    ],
    howToUseSteps: [
      {
        step: 1,
        title: 'Plugue o fone comum no furinho redondo',
        description: 'Empurre o pino do seu fone até o final dentro do furinho redondo do adaptador, até sentir um pequeno estalo suave.',
      },
      {
        step: 2,
        title: 'Conecte a outra ponta no celular',
        description: 'Encaixe a ponta fininha na mesma entrada onde você recarrega o celular na tomada.',
      }
    ],
    reviewsSummary: {
      averageRating: 4.3,
      satisfactionRate: 85,
      totalAnalyzed: 320,
      sources: [
        { sourceName: 'Fórum AppleBR', verdict: 'Resolve o problema para quem não quer gastar com fones sem fio caros.', isEditorial: true }
      ],
      pros: [
        'Permite continuar usando seu fone favorito que você já tem em casa',
        'Pequeno e leve, fácil de levar no bolso'
      ],
      cons: [
        'Como ocupa a entrada de energia, não dá para ouvir música e carregar o celular ao mesmo tempo'
      ]
    },
    priceData: {
      minPrice: 19.90,
      maxPrice: 69.00,
      lastUpdated: 'Hoje às 15:20 (Horário de Brasília)',
      stores: [
        { storeName: 'Mercado Livre', price: 19.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Amazon Brasil', price: 29.90, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true }
      ]
    },
    alternatives: [
      {
        id: 'adaptador-p2-usbc',
        name: 'Adaptador de Fone P2 para USB-C (Android e iPhone 15/16)',
        category: 'Cabos & Conectores',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'Muito parecido, mas a ponta é oval e oca (USB-C), para aparelhos modernos.'
      }
    ],
    commonQuestions: [
      {
        question: 'O microfone do meu fone continua funcionando para falar no WhatsApp?',
        answer: 'Sim! Esse adaptador transmite tanto o áudio dos fones quanto o microfone para conversar em chamadas.'
      }
    ],
    officialSupportPhone: '0800 761 0880'
  },
  {
    id: 'dongle-tv-stick',
    name: 'Smart TV Stick HDMI com Controle Remoto',
    popularName: 'Aparelhinho para transformar TV comum em Smart TV',
    category: 'TV & Vídeo',
    brand: 'Fire TV / Mi Stick / Chromecast',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: 'medium',
    confidenceScore: 72,
    shortSummary: 'Aparelho do tamanho de um pen drive que espeta na televisão para assistir YouTube, Netflix, Globoplay e canais sem precisar comprar uma TV nova.',
    safeToUseSummary: 'Liga direto na tomada ou na porta USB da televisão. Tem controle com botão de microfone para falar o nome do vídeo.',
    simplifiedSpecs: [
      {
        label: 'Como liga na TV',
        techJargon: 'Plugue Macho HDMI 2.0',
        humanExplanation: 'Espeta diretamente na entrada HDMI atrás da sua TV, sem cabos compridos pendurados.',
        iconName: 'Tv'
      },
      {
        label: 'Controle com Voz',
        techJargon: 'Comando de voz Alexa / Google Assistant',
        humanExplanation: 'Você segura o botão de microfone no controle e fala "colocar novela" ou "música de Roberto Carlos", e a TV obedece.',
        iconName: 'Mic'
      }
    ],
    howToUseSteps: [
      {
        step: 1,
        title: 'Espete na entrada HDMI da TV',
        description: 'Procure uma entrada HDMI livre atrás ou do lado da sua TV e espete o aparelhinho.',
      },
      {
        step: 2,
        title: 'Ligue o fio de energia na tomada',
        description: 'Use o cabinho que vem na caixa para ligar o aparelhinho na tomada com a fonte de energia.',
        highlightTip: 'Ele precisa de energia contínua para ligar e não desligar no meio do filme.'
      },
      {
        step: 3,
        title: 'Mude a TV para a entrada HDMI',
        description: 'No controle da TV, aperte a tecla "Input" ou "Source" e escolha a porta HDMI onde você espetou.',
      }
    ],
    reviewsSummary: {
      averageRating: 4.8,
      satisfactionRate: 95,
      totalAnalyzed: 2400,
      sources: [
        { sourceName: 'TechReviews BR', verdict: 'Melhor forma de renovar uma TV antiga sem gastar milhares de reais.', isEditorial: true }
      ],
      pros: [
        'Muito fácil de usar com o comando de voz no controle',
        'Não trava e tem todos os aplicativos populares do Brasil',
        'Pode levar em viagens e usar na TV do hotel ou casa de praia'
      ],
      cons: [
        'Precisa de sinal de Wi-Fi bom perto da televisão'
      ]
    },
    priceData: {
      minPrice: 189.00,
      maxPrice: 289.00,
      lastUpdated: 'Hoje às 14:00 (Horário de Brasília)',
      stores: [
        { storeName: 'Amazon Brasil', price: 189.00, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true },
        { storeName: 'Magazine Luiza', price: 219.00, currency: 'R$', condition: 'Novo', inStock: true, trustedBadge: true }
      ]
    },
    alternatives: [
      {
        id: 'tv-box-quadrada',
        name: 'Aparelho Receptor TV Box Quadrado',
        category: 'TV & Vídeo',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        differenceNote: 'É uma caixinha quadrada maior que fica sobre o móvel e precisa de um cabo HDMI avulso para ligar à TV.'
      }
    ],
    commonQuestions: [
      {
        question: 'Preciso pagar mensalidade para usar o aparelho?',
        answer: 'Não! O aparelho é seu para sempre. Você só paga se assinar canais pagos como Netflix ou Globoplay, mas o YouTube e canais gratuitos são 100% de graça.'
      }
    ],
    officialSupportPhone: '0800 038 0541'
  }
];

export const SAMPLE_SEARCH_TERMS = [
  'Fone Bluetooth',
  'Cabo HDMI',
  'Carregador USB-C',
  'Adaptador de Fone',
  'TV Stick HDMI'
];
