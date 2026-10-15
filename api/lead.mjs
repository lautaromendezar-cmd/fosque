// Intermediario del formulario de Experiencia → EVO (prospecto).
//
// El DNS y el token de EVO son usuario y contraseña del CRM: no pueden ir en
// el JS del sitio. El form le manda los datos a esta función y ella llama a
// EVO. Corre como función de Vercel (fosque-preview, framework: null → todo
// lo de /api es función). En el hosting del cliente (FTP, sin Node) lo va a
// hacer un lead.php equivalente, a armar al exportar: mantenerlos iguales.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   EVO_DNS         usuario que muestra EVO al crear el token
//   EVO_TOKEN       el token
//   EVO_SUCURSALES  JSON slug → idBranch, ej. {"jose-hernandez":1,"emilio-castro":2,"nunez":3}
//   EVO_MARKETING   (opcional) tipo de marketing tal cual está cargado en EVO

const EVO_URL = 'https://evo-integracao-api.w12app.com.br/api/v1/prospects';
const NOTA = 'Sesión sin cargo Web';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'método' });

  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  // Campo trampa: invisible para una persona, los bots lo completan.
  if (b.empresa) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim().replace(/\s+/g, ' ');
  const email = String(b.email || '').trim();
  const sede = String(b.sede || '');
  let cel = String(b.telefono || '').replace(/\D/g, '');
  if (cel.startsWith('54')) cel = cel.slice(2);
  if (!nombre || !/^\S+@\S+\.\S+$/.test(email) || cel.length < 8) {
    return res.status(400).json({ ok: false, error: 'datos' });
  }

  const { EVO_DNS, EVO_TOKEN, EVO_SUCURSALES, EVO_MARKETING } = process.env;
  const sucursales = safeJson(EVO_SUCURSALES || '') || {};
  if (!EVO_DNS || !EVO_TOKEN) return res.status(503).json({ ok: false, error: 'sin configurar' });
  const idBranch = sucursales[sede];
  if (!idBranch) return res.status(400).json({ ok: false, error: 'sucursal' });

  // EVO pide nombre y apellido por separado; el form tiene un solo campo.
  const [name, ...resto] = nombre.split(' ');
  const prospecto = {
    name,
    lastName: resto.join(' ') || '-',
    email,
    ddi: '+54',
    cellphone: cel,
    idBranch,
    notes: NOTA,
    ...(EVO_MARKETING ? { marketingType: EVO_MARKETING } : {}),
  };

  try {
    const r = await fetch(EVO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${EVO_DNS}:${EVO_TOKEN}`).toString('base64'),
      },
      body: JSON.stringify(prospecto),
    });
    const texto = await r.text();
    if (!r.ok) {
      console.error('EVO', r.status, texto.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'evo', status: r.status });
    }
    const data = safeJson(texto) || {};
    return res.status(200).json({ ok: true, idProspect: data.idProspect ?? null });
  } catch (e) {
    console.error('EVO red', e);
    return res.status(502).json({ ok: false, error: 'red' });
  }
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
