import { dispositivoRepository } from '../repositories/dispositivoRepository.js';

export const dispositivoService = {
  async registrarDispositivo(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Identificador de dispositivo inválido.');
    }

    let dispositivo = await dispositivoRepository.findById(id);
    if (!dispositivo) {
      dispositivo = await dispositivoRepository.create({ id });
    }
    return dispositivo;
  },

  async registrarAceitePrivacidade(id) {
    if (!id) {
      throw new Error('Identificador de dispositivo não fornecido.');
    }
    // Garante que o dispositivo existe antes de atualizar
    await this.registrarDispositivo(id);
    return dispositivoRepository.updatePrivacy(id);
  }
};

