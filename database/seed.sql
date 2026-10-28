-- =====================================================================
-- TechLens Seed Data Script
-- Popula dados iniciais dos produtos, especificações, avaliações,
-- comparações, preços nas lojas solicitadas e histórico de exemplo.
-- =====================================================================

USE `techlens`;

-- Limpa dados anteriores preservando estrutura
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `mensagem_chat`;
TRUNCATE TABLE `pesquisa`;
TRUNCATE TABLE `preco`;
TRUNCATE TABLE `comparacao`;
TRUNCATE TABLE `fonte`;
TRUNCATE TABLE `avaliacao_resumo`;
TRUNCATE TABLE `especificacao`;
TRUNCATE TABLE `produto`;
TRUNCATE TABLE `dispositivo`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. Inserir Dispositivo de Demonstração
-- ---------------------------------------------------------------------
INSERT INTO `dispositivo` (`id`, `criado_em`, `privacidade_aceita_em`) VALUES
('test-device-uuid-0001', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY);

-- ---------------------------------------------------------------------
-- 2. Inserir Produtos
-- ---------------------------------------------------------------------
-- Produto 1: Fone Bluetooth SoundMax Pro
INSERT INTO `produto` (
  `id`, `nome`, `marca`, `modelo`, `categoria`, `imagem_url`, `resumo_simples`, `criado_em`
) VALUES (
  1,
  'Fone Bluetooth SoundMax Pro',
  'SoundMax',
  'Pro TWS-500',
  'Áudio',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  'Par de fones de ouvido sem fio com estojo portátil. Eles conectam com seu celular pelo Bluetooth para você ouvir músicas, chamadas e áudios com total liberdade.',
  NOW() - INTERVAL 10 DAY
);

-- Produto 2: Roteador Wi-Fi 6 Dual Band Gigabit
INSERT INTO `produto` (
  `id`, `nome`, `marca`, `modelo`, `categoria`, `imagem_url`, `resumo_simples`, `criado_em`
) VALUES (
  2,
  'Roteador Wi-Fi 6 Dual Band Gigabit',
  'NetSpeed',
  'AX1800 Ultra',
  'Redes & Conectividade',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  'Aparelho de quatro antenas que distribui sinal de internet sem fio ultrarrápido para celulares, Smart TVs e computadores de toda a casa sem travar.',
  NOW() - INTERVAL 8 DAY
);

-- Produto 3: Cabo HDMI 2.1 Ultra High Speed
INSERT INTO `produto` (
  `id`, `nome`, `marca`, `modelo`, `categoria`, `imagem_url`, `resumo_simples`, `criado_em`
) VALUES (
  3,
  'Cabo HDMI 2.1 Ultra High Speed',
  'VisionCable',
  '8K Armor 2m',
  'Cabos & Conectores',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Cabo com pontas douradas reforçadas que transmite imagem cristalina e som de alta definição do receptor de TV, videogame ou notebook direto para a televisão.',
  NOW() - INTERVAL 7 DAY
);

-- Produto 4: Smartwatch HealthFit Pulse
INSERT INTO `produto` (
  `id`, `nome`, `marca`, `modelo`, `categoria`, `imagem_url`, `resumo_simples`, `criado_em`
) VALUES (
  4,
  'Smartwatch HealthFit Pulse',
  'HealthFit',
  'Pulse V2',
  'Vestíveis & Saúde',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
  'Relógio de pulso inteligente que mede batimentos cardíacos, conta passos da caminhada, analisa a qualidade do sono e avisa no pulso quando chegam mensagens.',
  NOW() - INTERVAL 6 DAY
);

-- ---------------------------------------------------------------------
-- 3. Inserir Especificações Traduzidas
-- ---------------------------------------------------------------------
-- Produto 1: Fone SoundMax Pro
INSERT INTO `especificacao` (`produto_id`, `termo`, `valor`, `explicacao_simples`) VALUES
(1, 'Bluetooth 5.3', 'Alcance de 10 metros', 'Conecta sem fios pelo ar com o seu celular. Dá para deixar o telefone na sala e ouvir música na cozinha tranquilamente.'),
(1, 'Duração da Bateria', '5 a 6 horas contínuas', 'Você pode ouvir áudios e músicas direto por até 6 horas antes de precisar guardar os fones no estojo para recarregar.'),
(1, 'Estojo Carregador', 'Até 3 cargas completas', 'A caixinha tem bateria própria e recarrega os fones sem precisar estar ligada na tomada.'),
(1, 'Resistência à Água', 'Certificação IPX4', 'Aguenta suor de caminhada e respingos leves de chuva. Atenção: Não pode tomar banho nem mergulhar.');

-- Produto 2: Roteador Wi-Fi 6
INSERT INTO `especificacao` (`produto_id`, `termo`, `valor`, `explicacao_simples`) VALUES
(2, 'Padrão Wi-Fi 6 (802.11ax)', 'Até 1800 Mbps', 'Tecnologia moderna que suporta dezenas de aparelhos conectados ao mesmo tempo sem que a internet engasgue.'),
(2, 'Dual Band (2.4 GHz e 5.0 GHz)', 'Duas redes sem fio juntas', 'A rede 2.4 GHz atravessa paredes e alcança o quintal; a rede 5.0 GHz entrega máxima velocidade perto do aparelho.'),
(2, 'Portas de Cabo Gigabit', '4 portas amarelas traseiras', 'Permite ligar Smart TVs e computadores com cabo de rede para assistir vídeos em altíssima resolução sem perda.');

-- Produto 3: Cabo HDMI 2.1
INSERT INTO `especificacao` (`produto_id`, `termo`, `valor`, `explicacao_simples`) VALUES
(3, 'Velocidade de Transmissão', '48 Gbps (suporta até 8K)', 'Leva o vídeo mais nítido e o som mais potente em um único cabo, sem atrasos na imagem.'),
(3, 'Comprimento', '2 metros de cabo trançado', 'Tamanho ideal para conectar o aparelho que fica na estante ou rack até a TV na parede.'),
(3, 'Conectores Banhados a Ouro', 'Padrão HDMI Tipo A', 'Protege contra ferrugem e mau contato por muitos anos.');

-- Produto 4: Smartwatch HealthFit
INSERT INTO `especificacao` (`produto_id`, `termo`, `valor`, `explicacao_simples`) VALUES
(4, 'Sensor Cardíaco', 'Leitura contínua no pulso', 'Mede os batimentos do coração na hora e ajuda a acompanhar se você está forçando demais na caminhada.'),
(4, 'Bateria', 'Até 7 dias de uso', 'Você só precisa colocar no carregador magnético uma vez por semana.'),
(4, 'Tela AMOLED', '1.43 polegadas colorida', 'Números bem grandes e fáceis de ler mesmo debaixo da luz forte do sol.');

-- ---------------------------------------------------------------------
-- 4. Inserir Resumo de Avaliações
-- ---------------------------------------------------------------------
INSERT INTO `avaliacao_resumo` (`produto_id`, `pontos_positivos`, `pontos_atencao`, `gerado_em`) VALUES
(1, '["Encaixe anatômico confortável que não machuca os ouvidos","Volume alto e nítido para ouvir áudios e chamadas","Estojo compacto cabe fácil no bolso da calça"]', '["Não acompanha fonte de tomada na caixa (apenas o cabo de carregar)","Sensor de toque pode pausar se esbarrar sem querer"]', NOW() - INTERVAL 10 DAY),
(2, '["Sinal forte em todos os cômodos da casa","Fácil de configurar pelo aplicativo no celular","Não trava mesmo com a família toda assistindo vídeos"]', '["As luzes frontais podem incomodar no quarto à noite se não forem desligadas no aplicativo"]', NOW() - INTERVAL 8 DAY),
(3, '["Basta encaixar e funciona na hora sem precisar configurar","Cabo resistente que não quebra fácil","Imagem sem falhas na televisão"]', '["O revestimento de nylon deixa o cabo um pouco rígido para curvas muito apertadas"]', NOW() - INTERVAL 7 DAY),
(4, '["Excelente para idosos acompanharem os passos e a saúde","Pulseira macia que não causa alergia","Notificações no pulso ajudam a não perder ligações importantes"]', '["Não substitui exames médicos hospitalares completos"]', NOW() - INTERVAL 6 DAY);

-- ---------------------------------------------------------------------
-- 5. Inserir Fontes Editoriais e de Especificação
-- ---------------------------------------------------------------------
INSERT INTO `fonte` (`produto_id`, `tipo`, `nome`, `url`) VALUES
(1, 'avaliacao', 'TechReviews BR', 'https://techreviews.exemplo.com/soundmax-pro'),
(1, 'avaliacao', 'Fórum do Consumidor', 'https://forumconsumidor.exemplo.com/tws'),
(1, 'especificacao', 'Manual Oficial SoundMax', 'https://soundmax.exemplo.com/manual'),
(2, 'avaliacao', 'Portal RedesBrasil', 'https://redesbrasil.exemplo.com/ax1800'),
(2, 'especificacao', 'NetSpeed Global', 'https://netspeed.exemplo.com/spec'),
(3, 'avaliacao', 'Guia do Hardware BR', 'https://guiadohardware.exemplo.com/hdmi21'),
(3, 'especificacao', 'Consórcio Internacional HDMI', 'https://hdmi.org/spec'),
(4, 'avaliacao', 'Portal Saúde Digital BR', 'https://saudedigital.exemplo.com/healthfit'),
(4, 'especificacao', 'HealthFit Laboratórios', 'https://healthfit.exemplo.com/docs');

-- ---------------------------------------------------------------------
-- 6. Inserir Comparações com Produtos Semelhantes
-- ---------------------------------------------------------------------
INSERT INTO `comparacao` (`produto_id`, `produto_comparado_nome`, `preco_referencia`, `diferencas`, `resumo`) VALUES
(1, 'Redmi AirDots 2', 89.90, 'O AirDots possui botão com clique físico, enquanto o SoundMax Pro tem controles por toque suave.', 'O SoundMax Pro entrega bateria um pouco mais duradoura e estojo menor.'),
(1, 'Fone com Fio Tradicional P2', 29.90, 'O fone com fio não precisa de recarga de bateria, mas fica fisicamente preso ao smartphone.', 'O SoundMax oferece total liberdade de movimento sem fios enroscando na roupa.'),
(2, 'Roteador Wi-Fi 4 Monobanda Antigo', 79.90, 'O modelo antigo opera em apenas uma frequência (2.4 GHz) e trava quando mais de 3 pessoas usam juntas.', 'O Wi-Fi 6 é até 4 vezes mais rápido e mantém a conexão de toda a casa estável.'),
(3, 'Cabo RCA de 3 Pontas (Amarelo, Branco, Vermelho)', 14.90, 'Cabo analógico antigo para TVs de tubo, com baixa resolução e muitos fios soltos.', 'O HDMI 2.1 substitui todos os fios por um único cabo digital de alta definição.'),
(4, 'Relógio Digital Simples', 49.90, 'Mostra apenas as horas e cronômetro simples, sem conexão com celular.', 'O Smartwatch acompanha sua saúde e frequência cardíaca em tempo real.');

-- ---------------------------------------------------------------------
-- 7. Inserir Preços (incluindo as lojas solicitadas: TechStore Brasil, MegaEletro, Lojas Universo)
-- ---------------------------------------------------------------------
-- Preços consultados recentemente (menos de 24h para simulação fresca)
INSERT INTO `preco` (`produto_id`, `loja`, `valor`, `url`, `consultado_em`) VALUES
(1, 'TechStore Brasil', 79.90, 'https://techstore.exemplo.com/soundmax-pro', NOW() - INTERVAL 2 HOUR),
(1, 'MegaEletro', 84.50, 'https://megaeletro.exemplo.com/soundmax', NOW() - INTERVAL 2 HOUR),
(1, 'Lojas Universo', 92.00, 'https://lojasuniverso.exemplo.com/soundmax-tws', NOW() - INTERVAL 2 HOUR),

(2, 'TechStore Brasil', 249.90, 'https://techstore.exemplo.com/ax1800', NOW() - INTERVAL 3 HOUR),
(2, 'MegaEletro', 269.00, 'https://megaeletro.exemplo.com/ax1800', NOW() - INTERVAL 3 HOUR),
(2, 'Lojas Universo', 259.90, 'https://lojasuniverso.exemplo.com/ax1800', NOW() - INTERVAL 3 HOUR),

(3, 'MegaEletro', 29.90, 'https://megaeletro.exemplo.com/cabo-hdmi', NOW() - INTERVAL 4 HOUR),
(3, 'TechStore Brasil', 34.90, 'https://techstore.exemplo.com/cabo-hdmi', NOW() - INTERVAL 4 HOUR),
(3, 'Lojas Universo', 39.90, 'https://lojasuniverso.exemplo.com/cabo-hdmi', NOW() - INTERVAL 4 HOUR),

(4, 'Lojas Universo', 159.00, 'https://lojasuniverso.exemplo.com/healthfit-pulse', NOW() - INTERVAL 5 HOUR),
(4, 'TechStore Brasil', 169.90, 'https://techstore.exemplo.com/healthfit-pulse', NOW() - INTERVAL 5 HOUR),
(4, 'MegaEletro', 179.00, 'https://megaeletro.exemplo.com/healthfit-pulse', NOW() - INTERVAL 5 HOUR);

-- ---------------------------------------------------------------------
-- 8. Inserir Histórico de Pesquisas de Exemplo
-- ---------------------------------------------------------------------
INSERT INTO `pesquisa` (
  `id`, `dispositivo_id`, `produto_id`, `tipo_entrada`, `termo_digitado`, `confianca`, `status`, `criado_em`
) VALUES
(1, 'test-device-uuid-0001', 1, 'foto', NULL, 'alta', 'confirmado', NOW() - INTERVAL 2 DAY),
(2, 'test-device-uuid-0001', 3, 'texto', 'cabo para ligar videogame na TV', 'alta', 'confirmado', NOW() - INTERVAL 1 DAY),
(3, 'test-device-uuid-0001', 4, 'texto', 'relogio que mede batimento', 'media', 'confirmado', NOW() - INTERVAL 5 HOUR);

-- ---------------------------------------------------------------------
-- 9. Inserir Mensagens de Chat de Exemplo
-- ---------------------------------------------------------------------
INSERT INTO `mensagem_chat` (`pesquisa_id`, `autor`, `conteudo`, `criado_em`) VALUES
(1, 'usuario', 'Tem perigo de dar choque se eu colocar o fone no ouvido enquanto estiver chovendo?', NOW() - INTERVAL 2 DAY + INTERVAL 2 MINUTE),
(1, 'ia', 'Pode ficar tranquilo(a)! A voltagem do fone é minúscula (cerca de 3.7 volts), totalmente inofensiva para o corpo humano. Apenas evite molhar o fone na chuva forte para não danificar o aparelho por dentro.', NOW() - INTERVAL 2 DAY + INTERVAL 3 MINUTE),
(1, 'usuario', 'Como sei se a caixinha terminou de carregar na tomada?', NOW() - INTERVAL 2 DAY + INTERVAL 5 MINUTE),
(1, 'ia', 'A caixinha tem uma luzinha de LED. Enquanto ela estiver piscando, está carregando. Quando a luz parar de piscar e ficar acesa direto (ou verde), a carga já está 100% pronta e você pode tirar da tomada!', NOW() - INTERVAL 2 DAY + INTERVAL 6 MINUTE);
