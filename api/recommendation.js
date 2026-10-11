// Envía recomendaciones de canciones al mismo Apps Script que recibe las inscripciones.
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyZukJNbvivF5ZTESvbrXQsRF9udZP_MD75Qvy4fODcsg5PDd3PgfJpK0buf0w-nRQ5rw/exec';
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,message:'Método no permitido.'});
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!payload || !String(payload.song || '').trim()) return res.status(400).json({ok:false,message:'Escribe la canción que recomiendas.'});
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set('api','recommendation');
    const upstream = await fetch(url.toString(), {
      method:'POST', redirect:'follow',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('Apps Script no ha devuelto una respuesta JSON válida para la recomendación.'); }
    if (!upstream.ok || data.ok === false) throw new Error(data.message || 'No se pudo guardar la recomendación.');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ok:false,message:err.message || 'Error enviando la recomendación.'});
  }
};
