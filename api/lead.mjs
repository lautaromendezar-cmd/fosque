// Intermediario del formulario de Experiencia → EVO (prospecto).
//
// El DNS y el token de EVO son usuario y contraseña del CRM: no pueden ir en
// el JS del sitio. El form le manda los datos a esta función y ella llama a
// EVO. Corre como función de Vercel (fosque-preview, framework: null → todo
// lo de /api es función). En el hosting del cliente (FTP, sin Node) lo
// hace deploy/api/lead.php: mantenerlos iguales.
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
  // +54 9 11… (formato internacional de celular) y 011…: quedan como 11…,
  // igual que si se escribe a secas, para que la búsqueda de repetidos coincida.
  if (cel.length === 11 && /^[90]/.test(cel)) cel = cel.slice(1);
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
    // Sin gender EVO pone Masculino; la campaña es para la Mujer Fosque.
    gender: 'F',
    ddi: '+54',
    cellphone: cel,
    idBranch,
    notes: NOTA,
    ...(EVO_MARKETING ? { marketingType: EVO_MARKETING } : {}),
  };

  const auth = 'Basic ' + Buffer.from(`${EVO_DNS}:${EVO_TOKEN}`).toString('base64');

  // Si la persona ya está en EVO (mismo mail o celular) no se crea otro
  // prospecto: alguien que manda el form dos veces quedaba repetido.
  const existente = (await buscar(auth, { email }, (p) => igualMail(p.email, email)))
    ?? (await buscar(auth, { phone: cel }, (p) => igualCel(p.cellphone, cel)));
  if (existente) return res.status(200).json({ ok: true, idProspect: existente, repetido: true });

  try {
    const r = await fetch(EVO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
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

// Devuelve el idProspect de un prospecto que ya coincide, o null. Si la
// búsqueda falla devuelve null y el lead se crea igual: mejor un repetido que
// un lead perdido. `coincide` revisa cada resultado por si EVO ignorara el
// filtro (no descartar a nadie por error).
async function buscar(auth, filtro, coincide) {
  try {
    const r = await fetch(`${EVO_URL}?${new URLSearchParams({ ...filtro, take: '10' })}`, {
      headers: { Authorization: auth },
    });
    if (!r.ok) {
      console.error('EVO buscar', r.status, (await r.text()).slice(0, 300));
      return null;
    }
    const lista = safeJson(await r.text());
    const p = Array.isArray(lista) ? lista.find(coincide) : null;
    return p ? p.idProspect ?? null : null;
  } catch (e) {
    console.error('EVO buscar red', e);
    return null;
  }
}

function igualMail(a, b) {
  return String(a || '').trim().toLowerCase() === b.toLowerCase();
}

// EVO puede guardar el celular con o sin 54 / +54: comparar por el final.
function igualCel(a, cel) {
  const d = String(a || '').replace(/\D/g, '');
  return d.length >= 8 && (d.endsWith(cel) || cel.endsWith(d));
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
