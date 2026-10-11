// Despliegue web de Apps Script INSCRIPCION. Se puede sobrescribir desde Vercel.
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyZukJNbvivF5ZTESvbrXQsRF9udZP_MD75Qvy4fODcsg5PDd3PgfJpK0buf0w-nRQ5rw/exec';
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!APPS_SCRIPT_URL) return res.status(500).json({ ok: false, message: 'Falta configurar APPS_SCRIPT_URL en Vercel.' });
  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set('api', 'catalog');
    const upstream = await fetch(url.toString(), { redirect: 'follow' });
    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('Apps Script aún no tiene activada la API JSON del catálogo.'); }
    if (!upstream.ok || data.ok === false) throw new Error(data.message || 'No se pudo leer el catálogo.');
    return res.status(200).json(data.catalog ? data : { ok: true, catalog: data });
  } catch (err) {
    return res.status(502).json({ ok: false, message: err.message || 'Error conectando con el catálogo.' });
  }
};