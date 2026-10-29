export function deviceIdMiddleware(req, res, next) {
  const headerDeviceId = req.headers['x-device-id'];
  const bodyDeviceId = req.body && req.body.dispositivo_id;
  const queryDeviceId = req.query && req.query.dispositivo_id;

  const deviceId = headerDeviceId || bodyDeviceId || queryDeviceId;

  if (!deviceId || typeof deviceId !== 'string' || !deviceId.trim()) {
    return res.status(400).json({
      erro: 'Identificador do dispositivo não encontrado. Por favor, recarregue a página para gerar uma identificação segura.'
    });
  }

  req.deviceId = deviceId.trim();
  next();
}

