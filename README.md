# TechLens — Assistente Inteligente de Eletrônicos & Cabos

> Assistente web inteligente orientado por Inteligência Artificial (Visão Computacional + LLM) criado para democratizar o entendimento de aparelhos eletrônicos, cabos, adaptadores e conectores para pessoas leigas em tecnologia e idosos.

---

## 🚀 Sobre o Projeto

O **TechLens** foi concebido sob rigorosos princípios de acessibilidade (**WCAG 2.1 AAA**), redução de ansiedade e transparência ética. Ele permite que qualquer pessoa — como a **Dona Maria (68 anos)** ou o **Carlos (45 anos)** — aponte a câmera para um aparelho, cabo ou conector desconhecido e receba uma explicação em português simples, com metáforas práticas, passo a passo ilustrado, preços de mercado e leitura em áudio por voz.

---

## 🎨 Design System: Modern Bio-Tech

- **Tipografia:** Plus Jakarta Sans (alta legibilidade em diferentes escalas)
- **Paleta de Cores:**
  - **Azul Primário (`#2563EB`)**: Ações principais, links e avanço
  - **Violeta IA (`#7C3AED` / `#6D28D9`)**: Identificação por inteligência artificial e assistente conversacional
  - **Verde Menta (`#10B981`)**: Confirmação positiva, preços seguros e alertas de segurança
  - **Superfície:** Fundo suave (`#FAFAFC` / `#FAF8FF`) com contraste tipográfico superior a 7:1
- **Acessibilidade Nativa (WCAG AAA):**
  - Controles dinâmicos de tamanho de fonte (`A-` e `A+`)
  - Alternador de Alto Contraste
  - Botão de leitura por voz (**Web Speech API - Text-to-Speech**)
  - Áreas de toque com altura mínima de 48px

---

## 📱 Mapeamento Completo das 10 Telas do PRD

| # | Tela | ID PRD | Funcionalidades Principais |
|---|---|---|---|
| **01** | **Início e Captura de Imagem** | `SCREEN_21` | Captura ao vivo pela câmera (Webcam/Mobile via `getUserMedia`), upload de arquivos (.jpg, .png, .webp), busca digitada direta (RF-03), modal de consentimento de privacidade no 1º uso (RF-02) e exemplos de teste rápido em 1 clique. |
| **02** | **Analisando Aparelho com IA** | `SCREEN_19` | Scanner suave com feixe bio-tech sem caixas delimitadoras confusas. Processamento em 2 etapas: (1) Nitidez e luz e (2) Formato e pinos. |
| **03** | **Confirmação (Alta Certeza)** | `SCREEN_17` | Exibição do modelo identificado com selo de alta chance de acerto (> 80%), fotos e botão vibrante *"Sim, é exatamente este!"*. |
| **03B**| **Confirmação (Baixa Certeza)** | `SCREEN_3` | Opções de modelos e cabos alternativos parecidos, alerta amigável de cautela e atalho para digitar o nome. |
| **04** | **Buscando Informações** | `SCREEN_9` | Tela de carregamento pós-confirmação com barra de progresso em 3 etapas com checks dinâmicos (Termos traduzidos, Avaliações e Preços). |
| **05** | **Guia Completo e Traduzido** | `SCREEN_15` | Dicionário técnico traduzido (RF-06), botão *"Ouvir em Voz Alta"* com animação de ondas sonoras, passo a passo de como ligar pela 1ª vez, avaliações independentes (RF-07) e comparador de preços com data/hora e aviso legal (RF-08). |
| **06** | **Tire suas Dúvidas (Chat IA)** | `SCREEN_11` | Conversa contextualizada pelo manual do aparelho, perguntas rápidas de 1 clique, áudio para respostas, aviso fixo de segurança e atalho para SAC/0800 gratuito. |
| **07** | **Histórico de Pesquisas** | `SCREEN_13` | Registros armazenados localmente no navegador (`localStorage`), filtros por categoria, busca textual, exclusão em 2 etapas com modal (RF-10) e suporte total a navegação offline (RF-11). |
| **08** | **Privacidade e Proteção (LGPD)** | `SCREEN_5` | Explicação de que a IA analisa somente contornos e pinos, guia visual do que fotografar vs o que NUNCA fotografar (rostos/documentos) e conformidade LGPD. |
| **09** | **Central de Diagnóstico & Erros** | `SCREEN_7` | Tratamento humanizado sem códigos de erro técnicos para os 5 cenários comuns: foto escura, objeto não eletrônico, modelo desconhecido, sem internet e instabilidade. Inclui simulador interativo dos 5 cenários. |

---

## 🛠️ Tecnologias Utilizadas

- **React 19 & TypeScript**
- **Vite 6**
- **Tailwind CSS**
- **Lucide Icons**
- **Web Speech API (SpeechSynthesis)**
- **HTML5 Camera Stream (`navigator.mediaDevices.getUserMedia`)**

---

## 💻 Como Rodar Localmente

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Gerar a build de produção:
   ```bash
   npm run build
   ```
