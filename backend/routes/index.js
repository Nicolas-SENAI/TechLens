import { Router } from 'express';
import { dispositivoController } from '../controllers/dispositivoController.js';
import { pesquisaController } from '../controllers/pesquisaController.js';
import { produtoController } from '../controllers/produtoController.js';
import { chatController } from '../controllers/chatController.js';
import { deviceIdMiddleware } from '../middlewares/deviceIdMiddleware.js';

const router = Router();

// ---------------------------------------------------------------------
// Rotas de Dispositivo (Identificação Anônima & Privacidade)
// ---------------------------------------------------------------------
router.post('/dispositivos', dispositivoController.registrar);
router.patch('/dispositivos/privacidade', deviceIdMiddleware, dispositivoController.aceitarPrivacidade);

// ---------------------------------------------------------------------
// Rotas de Pesquisas & Histórico (Identificação & Confirmação)
// ---------------------------------------------------------------------
router.post('/pesquisas', deviceIdMiddleware, pesquisaController.criar);
router.patch('/pesquisas/:id/confirmar', deviceIdMiddleware, pesquisaController.confirmar);
router.get('/pesquisas', deviceIdMiddleware, pesquisaController.listarHistorico);
router.delete('/pesquisas', deviceIdMiddleware, pesquisaController.apagarHistorico);

// ---------------------------------------------------------------------
// Rotas de Produtos (Catálogo, Especificações, Avaliações e Preços)
// ---------------------------------------------------------------------
router.get('/produtos/:id', produtoController.obter);
router.get('/produtos', produtoController.listar);

// ---------------------------------------------------------------------
// Rotas de Chat (Dúvidas com IA contextualizadas)
// ---------------------------------------------------------------------
router.get('/pesquisas/:id/mensagens', deviceIdMiddleware, chatController.listarMensagens);
router.post('/pesquisas/:id/mensagens', deviceIdMiddleware, chatController.enviarMensagem);

export default router;

