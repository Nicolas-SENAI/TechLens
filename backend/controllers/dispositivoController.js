import { dispositivoService } from '../services/dispositivoService.js';

export const dispositivoController = {
  async registrar(req, res, next) {
    try {
      const deviceId = req.body?.id || req.headers['x-device-id'] || req.deviceId;
      if (!deviceId) {
        return res.status(400).json({ erro: 'Identificador do dispositivo não informado.' });
      }

      const dispositivo = await dispositivoService.registrarDispositivo(deviceId);
      return res.status(201).json({
        sucesso: true,
        dispositivo
      });
    } catch (err) {
      next(err);
    }
  },

  async aceitarPrivacidade(req, res, next) {
    try {
      const deviceId = req.deviceId;
      const dispositivo = await dispositivoService.registrarAceitePrivacidade(deviceId);
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Consentimento de privacidade registrado com sucesso.',
        dispositivo
      });
    } catch (err) {
      next(err);
    }
  }
};

