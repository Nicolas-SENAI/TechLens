import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
// Suporta envio de foto em base64 na memória efêmera (Regra 2: não salva em disco)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota de diagnóstico de saúde da API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    servico: 'TechLens Backend API',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rotas principais da API
app.use('/api', routes);

// Middleware global de tratamento de erros
app.use(errorHandler);

// Inicia servidor apenas se executado diretamente
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('backend/server.js')) {
  app.listen(PORT, () => {
    console.log(`✅ TechLens API rodando com sucesso em http://localhost:${PORT}`);
  });
}

export default app;
