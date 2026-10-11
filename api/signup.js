const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Método no permitido.' });
  if (!APPS_SCRIPT_URL) return res.status(500).json({ ok: false, message: 'Falta configurar APPS_SCRIPT_URL en Vercel.' });
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!payload || !payload.language || !payload.artist || !payload.song || !String(payload.singerName || '').trim()) {
      return res.status(400).json({ ok: false, message: 'Completa todos los campos antes de enviar.' });
    }
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set('api', 'signup');
    const upstream = await fetch(url.toString(), {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('Apps Script aún no tiene activada la API JSON para registrar inscripciones.'); }
    if (!upstream.ok || data.ok === false) throw new Error(data.message || 'No se pudo registrar la inscripción.');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ ok: false, message: err.message || 'Error enviando la inscripción.' });
  }
};