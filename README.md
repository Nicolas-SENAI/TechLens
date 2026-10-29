# TechLens — Assistente Inteligente de Eletrônicos & Cabos

> Assistente web inteligente orientado por Inteligência Artificial (Visão Computacional + LLM) criado para democratizar o entendimento de aparelhos eletrônicos, cabos, adaptadores e conectores para pessoas leigas em tecnologia e idosos.

---

## 🏛️ Arquitetura da Solução

O TechLens foi estruturado com uma separação clara entre **Front-end (React + TypeScript + Tailwind CSS)** e **Back-end (Node.js + Express + MySQL)**, seguindo a arquitetura em camadas:

```
[ Front-end (React 19 / Vite) ]
          │
          │ HTTP / JSON (Header: X-Device-Id)
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Back-end Express (Node.js)                                  │
│                                                             │
│ 1. Middlewares (deviceIdMiddleware, errorHandler)           │
│ 2. Rotas (/api/dispositivos, /api/pesquisas, /api/produtos) │
│ 3. Controllers (dispositivo, pesquisa, produto, chat)       │
│ 4. Services (dispositivo, pesquisa, produto, chat, iaService)│
│ 5. Repositories (acesso parametrizado via mysql2 pool)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Pool de Conexões (utf8mb4)
                               ▼
                [ Banco de Dados MySQL Local ]
```

---

## 📊 Modelo de Dados Relacional (MySQL)

O banco de dados utiliza o charset **`utf8mb4`** e collation **`utf8mb4_unicode_ci`** em todas as tabelas:

| Tabela | Chave Primária | Chaves Estrangeiras & Regras | Descrição |
|---|---|---|---|
| `dispositivo` | `id` (VARCHAR 36 UUID) | — | Identificador anônimo do dispositivo do usuário (sem login). |
| `produto` | `id` (INT Auto) | — | Catálogo de aparelhos e cabos eletrônicos. |
| `especificacao` | `id` (INT Auto) | `produto_id` -> `produto(id)` ON DELETE CASCADE | Especificações técnicas traduzidas para linguagem simples. |
| `avaliacao_resumo` | `id` (INT Auto) | `produto_id` -> `produto(id)` ON DELETE CASCADE | Síntese de pontos positivos e pontos de atenção. |
| `fonte` | `id` (INT Auto) | `produto_id` -> `produto(id)` ON DELETE CASCADE | Portais editoriais e fontes independentes. |
| `comparacao` | `id` (INT Auto) | `produto_id` -> `produto(id)` ON DELETE CASCADE | Produtos semelhantes ou alternativos com diferenças explicadas. |
| `preco` | `id` (INT Auto) | `produto_id` -> `produto(id)` ON DELETE CASCADE | Cotações em lojas (TechStore Brasil, MegaEletro, Lojas Universo) com carimbo de consulta. |
| `pesquisa` | `id` (INT Auto) | `dispositivo_id` -> `dispositivo(id)` ON DELETE CASCADE, `produto_id` -> `produto(id)` ON DELETE SET NULL | Histórico de consultas por foto ou texto do dispositivo. |
| `mensagem_chat` | `id` (INT Auto) | `pesquisa_id` -> `pesquisa(id)` ON DELETE CASCADE | Histórico de mensagens trocadas com a IA sobre a pesquisa. |

### Índices Criados:
- `idx_pesquisa_dispositivo` em `pesquisa(dispositivo_id)`
- `idx_pesquisa_produto` em `pesquisa(produto_id)`
- `idx_pesquisa_criado_em` em `pesquisa(criado_em)`
- `idx_especificacao_produto` em `especificacao(produto_id)`
- `idx_preco_produto` e `idx_preco_consultado_em` em `preco`
- `idx_mensagem_pesquisa` e `idx_mensagem_criado_em` em `mensagem_chat`

---

## 📋 Regras de Negócio Implementadas

1. **Sem Login (Identificação por Dispositivo):** No primeiro acesso, o front-end gera um UUID v4 persistido no `localStorage` e o envia no cabeçalho `X-Device-Id`. Cada usuário acessa apenas suas próprias pesquisas.
2. **Fotos Efêmeras:** Fotos enviadas pelo usuário trafegam apenas na memória volátil durante a inferência simulada da IA. **Nenhuma foto é salva em disco ou no banco**.
3. **Reaproveitamento de Dados e Expiração de Preços (24h):** Especificações e avaliações são reaproveitadas. Se a última consulta de preços tiver mais de 24 horas, o serviço busca e persiste automaticamente novas cotações com o timestamp atual.
4. **Carimbo de Preço:** A data e hora da cotação são registradas no banco e exibidas na tela (*"Preço consultado em..."*).
5. **Nível de Confiança Estrito:** O nível de confiança retornado e persistido é rigorosamente: `'alta'`, `'media'` ou `'baixa'`.
6. **Apagar Histórico em Cascata:** Ao limpar o histórico, todas as pesquisas e mensagens de chat vinculadas àquele dispositivo são removidas (`ON DELETE CASCADE`), sem apagar os produtos do catálogo.
7. **Registro de Privacidade:** Ao aceitar o termo no primeiro uso, a data/hora é registrada em `privacidade_aceita_em` no banco de dados.
8. **Modo Offline:** O front-end salva automaticamente uma cópia do histórico no `localStorage`. Sem internet, o histórico é exibido a partir dessa cópia e novas pesquisas são bloqueadas com a tela amigável de diagnóstico.

---

## 🚀 Como Instalar e Rodar o Projeto

### 1. Pré-requisitos
- Node.js 18+ instalado
- MySQL Server local ativo

### 2. Configurar o `.env`
Crie ou edite o arquivo `.env` na raiz do projeto (baseando-se no `.env.example`):

```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=techlens

# Chave de API do Google Gemini (Visão Computacional e Respostas Reais)
# Obtenha sua chave gratuita em: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=
```

> **Nota sobre o Google Gemini e Reconhecimento Real:**
> - Quando uma chave `GEMINI_API_KEY` válida for fornecida, o sistema aciona a IA multimodal do Google Gemini (`gemini-1.5-flash`), identificando qualquer produto a partir da foto ou do texto e persistindo suas especificações no MySQL.
> - Caso nenhuma chave esteja configurada ou ocorra instabilidade de rede, o TechLens aciona um sintetizador heurístico inteligente que reconhece centenas de eletrônicos (smartphones, TVs, cabos, alexa, notebooks, mouses, etc.) gerando dados técnicos reais e cotações em lojas brasileiras (Amazon, Mercado Livre, Magalu) sem nunca cair no comportamento repetitivo.

### 3. Criar e Popular o Banco de Dados
Execute o script automatizado que cria o banco `techlens`, todas as tabelas (`database/schema.sql`) e insere os dados de exemplo (`database/seed.sql`):

```bash
npm run db:setup
```

> **Produtos incluídos no Seed:**
> - Fone Bluetooth SoundMax Pro (com cotações nas lojas fictícias: *TechStore Brasil*, *MegaEletro*, *Lojas Universo*)
> - Roteador Wi-Fi 6 Dual Band Gigabit
> - Cabo HDMI 2.1 Ultra High Speed
> - Smartwatch HealthFit Pulse

### 4. Executar os Testes Automatizados dos Endpoints
Para testar todos os 10 endpoints da API contra o banco MySQL:

```bash
npm run test:api
```

Para testar a identificação dinâmica de produtos reais (iPhone 13, Smart TV LG 50", Alexa Echo Dot, Cabo USB-C, etc.):

```bash
npm run test:products
```

### 5. Iniciar o Back-end
```bash
npm run server
```
A API estará disponível em `http://localhost:3001`.

### 6. Iniciar o Front-end
Em outro terminal:
```bash
npm run dev
```
O front-end estará rodando em `http://localhost:5173` com proxy configurado para redirecionar chamadas `/api` diretamente ao backend!

---

## 📡 Endpoints da API

| Método | Endpoint | Cabeçalhos | Descrição |
|---|---|---|---|
| `POST` | `/api/dispositivos` | — | Registra o identificador do dispositivo (`id`). |
| `PATCH` | `/api/dispositivos/privacidade` | `X-Device-Id` | Registra o aceite do aviso de privacidade (`privacidade_aceita_em`). |
| `POST` | `/api/pesquisas` | `X-Device-Id` | Cria pesquisa (foto ou texto) e retorna o produto identificado e alternativas (mock IA). |
| `PATCH` | `/api/pesquisas/:id/confirmar` | `X-Device-Id` | Confirma o produto escolhido e retorna o guia completo. |
| `GET` | `/api/produtos/:id` | — | Retorna o produto com especificações, avaliações, fontes, comparações e preços (com checagem de 24h). |
| `GET` | `/api/pesquisas` | `X-Device-Id` | Retorna o histórico de pesquisas do dispositivo (filtro opcional: `?categoria=...`). |
| `DELETE` | `/api/pesquisas` | `X-Device-Id` | Apaga todo o histórico e conversas do dispositivo (em cascata). |
| `GET` | `/api/pesquisas/:id/mensagens`| `X-Device-Id` | Retorna o histórico de mensagens de chat da pesquisa. |
| `POST` | `/api/pesquisas/:id/mensagens`| `X-Device-Id` | Envia dúvida do usuário e gera resposta amigável da IA contextualizada no produto. |
| `GET` | `/api/health` | — | Verificação de disponibilidade da API. |
