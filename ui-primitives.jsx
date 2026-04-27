// Visual placeholders for product images — geometric, industrial style
const ProductImg = ({ kind, size = 'md', accent }) => {
  const wrap = {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
    position: 'relative', overflow: 'hidden',
  };
  const stroke = 'var(--text-muted)';
  const fill = 'var(--primary)';

  const shapes = {
    filter: (
      <svg viewBox="0 0 100 100" width="60%" height="60%">
        <rect x="35" y="20" width="30" height="60" fill="none" stroke={stroke} strokeWidth="2" rx="2"/>
        <path d="M40 25 L40 75 M45 25 L45 75 M50 25 L50 75 M55 25 L55 75 M60 25 L60 75" stroke={stroke} strokeWidth="1"/>
        <rect x="32" y="18" width="36" height="6" fill={fill}/>
        <rect x="42" y="76" width="16" height="8" fill={stroke}/>
      </svg>
    ),
    'oil-drum': (
      <svg viewBox="0 0 100 100" width="55%" height="55%">
        <ellipse cx="50" cy="22" rx="22" ry="6" fill="none" stroke={stroke} strokeWidth="2"/>
        <path d="M28 22 L28 78 Q28 84 50 84 Q72 84 72 78 L72 22" fill="none" stroke={stroke} strokeWidth="2"/>
        <line x1="28" y1="40" x2="72" y2="40" stroke={stroke} strokeWidth="1.5"/>
        <line x1="28" y1="60" x2="72" y2="60" stroke={stroke} strokeWidth="1.5"/>
        <rect x="40" y="48" width="20" height="8" fill={fill}/>
      </svg>
    ),
    oil: (
      <svg viewBox="0 0 100 100" width="50%" height="60%">
        <path d="M35 25 L35 80 Q35 86 50 86 Q65 86 65 80 L65 25 Z" fill="none" stroke={stroke} strokeWidth="2"/>
        <rect x="40" y="18" width="20" height="8" fill={stroke}/>
        <rect x="38" y="50" width="24" height="14" fill={fill}/>
      </svg>
    ),
    brake: (
      <svg viewBox="0 0 100 100" width="65%" height="65%">
        <rect x="20" y="30" width="60" height="40" rx="4" fill="none" stroke={stroke} strokeWidth="2"/>
        <rect x="22" y="32" width="56" height="36" fill={fill} opacity="0.15"/>
        <line x1="20" y1="40" x2="80" y2="40" stroke={stroke} strokeWidth="1"/>
        <circle cx="30" cy="50" r="3" fill={stroke}/>
        <circle cx="70" cy="50" r="3" fill={stroke}/>
        <rect x="20" y="68" width="60" height="6" fill={fill}/>
      </svg>
    ),
    battery: (
      <svg viewBox="0 0 100 100" width="65%" height="65%">
        <rect x="20" y="25" width="60" height="55" rx="2" fill="none" stroke={stroke} strokeWidth="2"/>
        <rect x="28" y="20" width="10" height="6" fill={stroke}/>
        <rect x="62" y="20" width="10" height="6" fill={stroke}/>
        <text x="34" y="55" fontSize="14" fontWeight="700" fill={fill} fontFamily="monospace">+</text>
        <text x="60" y="55" fontSize="14" fontWeight="700" fill={stroke} fontFamily="monospace">−</text>
        <rect x="22" y="68" width="56" height="10" fill={fill} opacity="0.6"/>
      </svg>
    ),
    tire: (
      <svg viewBox="0 0 100 100" width="70%" height="70%">
        <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="3"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke={stroke} strokeWidth="2"/>
        <circle cx="50" cy="50" r="10" fill={fill}/>
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a} x1="50" y1="50" x2={50 + 38 * Math.cos(a*Math.PI/180)} y2={50 + 38 * Math.sin(a*Math.PI/180)} stroke={stroke} strokeWidth="1.5" opacity="0.5"/>
        ))}
      </svg>
    ),
    'fuel-filter': (
      <svg viewBox="0 0 100 100" width="55%" height="55%">
        <path d="M40 20 L60 20 L60 30 L65 30 L65 75 Q65 82 50 82 Q35 82 35 75 L35 30 L40 30 Z" fill="none" stroke={stroke} strokeWidth="2"/>
        <rect x="38" y="40" width="24" height="30" fill={fill} opacity="0.3"/>
        <line x1="35" y1="50" x2="65" y2="50" stroke={stroke} strokeWidth="1"/>
        <line x1="35" y1="60" x2="65" y2="60" stroke={stroke} strokeWidth="1"/>
      </svg>
    ),
    shock: (
      <svg viewBox="0 0 100 100" width="40%" height="80%">
        <circle cx="50" cy="15" r="6" fill="none" stroke={stroke} strokeWidth="2"/>
        <rect x="44" y="20" width="12" height="20" fill={stroke}/>
        <path d="M40 40 L60 40 L60 70 L40 70 Z" fill="none" stroke={stroke} strokeWidth="2"/>
        <line x1="40" y1="48" x2="60" y2="48" stroke={fill} strokeWidth="2"/>
        <line x1="40" y1="55" x2="60" y2="55" stroke={fill} strokeWidth="2"/>
        <line x1="40" y1="62" x2="60" y2="62" stroke={fill} strokeWidth="2"/>
        <rect x="44" y="70" width="12" height="14" fill={stroke}/>
        <circle cx="50" cy="88" r="5" fill="none" stroke={stroke} strokeWidth="2"/>
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 100 100" width="40%" height="80%">
        <rect x="44" y="10" width="12" height="14" fill={stroke}/>
        <rect x="42" y="24" width="16" height="8" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <rect x="40" y="32" width="20" height="20" fill={fill} opacity="0.2" stroke={stroke} strokeWidth="1.5"/>
        <rect x="44" y="52" width="12" height="20" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <line x1="44" y1="56" x2="56" y2="56" stroke={stroke}/>
        <line x1="44" y1="62" x2="56" y2="62" stroke={stroke}/>
        <line x1="44" y1="68" x2="56" y2="68" stroke={stroke}/>
        <path d="M50 72 L48 86 L52 86 L50 95" stroke={fill} strokeWidth="2" fill="none"/>
      </svg>
    ),
    hose: (
      <svg viewBox="0 0 100 100" width="80%" height="60%">
        <path d="M10 50 Q30 20, 50 50 T 90 50" fill="none" stroke={stroke} strokeWidth="6"/>
        <path d="M10 50 Q30 20, 50 50 T 90 50" fill="none" stroke={fill} strokeWidth="2" strokeDasharray="3 5"/>
        <rect x="6" y="44" width="8" height="12" fill={stroke}/>
        <rect x="86" y="44" width="8" height="12" fill={stroke}/>
      </svg>
    ),
    disc: (
      <svg viewBox="0 0 100 100" width="70%" height="70%">
        <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="2"/>
        <circle cx="50" cy="50" r="32" fill={fill} opacity="0.08"/>
        <circle cx="50" cy="50" r="14" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="4" fill={stroke}/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
          <circle key={a} cx={50 + 22 * Math.cos(a*Math.PI/180)} cy={50 + 22 * Math.sin(a*Math.PI/180)} r="2" fill={stroke}/>
        ))}
      </svg>
    ),
    wiper: (
      <svg viewBox="0 0 100 100" width="80%" height="50%">
        <path d="M10 50 L90 50" stroke={stroke} strokeWidth="3"/>
        <rect x="20" y="48" width="60" height="4" fill={fill}/>
        <rect x="45" y="44" width="10" height="12" fill={stroke}/>
      </svg>
    ),
  };

  return (
    <div style={wrap} className={accent ? 'stripes' : ''}>
      {shapes[kind] || shapes.filter}
    </div>
  );
};

const formatCLP = (n) => '$' + n.toLocaleString('es-CL');

// PPU — Precio Por Unidad de medida (Sernac/Ley 21.398).
// Parses the product name for "208L", "20L", "5 L", "500 ml", "kit x6", "x12", "1 kg", "500g",
// "180Ah" (batteries), "1.5m" (hoses), "(par)" (pairs).
// Returns { ppu, unit, base } where ppu is price per base-unit.
// Returns null when the product isn't comparable (no measurable unit).
const computePPU = (product) => {
  if (!product || !product.name) return null;
  const name = product.name;

  // Liquids: NN L (with optional decimal), NN ml, NN cc
  const litMatch = name.match(/(\d+(?:[.,]\d+)?)\s*L\b/i);
  if (litMatch) {
    const liters = parseFloat(litMatch[1].replace(',', '.'));
    if (liters > 0) return { ppu: product.price / liters, unit: 'L', base: liters + ' L' };
  }
  const mlMatch = name.match(/(\d+(?:[.,]\d+)?)\s*(?:ml|cc)\b/i);
  if (mlMatch) {
    const liters = parseFloat(mlMatch[1].replace(',', '.')) / 1000;
    if (liters > 0) return { ppu: product.price / liters, unit: 'L', base: (liters * 1000) + ' ml' };
  }

  // Battery: NN Ah → CLP / Ah
  const ahMatch = name.match(/(\d+(?:[.,]\d+)?)\s*Ah\b/i);
  if (ahMatch) {
    const ah = parseFloat(ahMatch[1].replace(',', '.'));
    if (ah > 0) return { ppu: product.price / ah, unit: 'Ah', base: ah + ' Ah' };
  }

  // Length: meters
  const mMatch = name.match(/(\d+(?:[.,]\d+)?)\s*m\b/i);
  if (mMatch && !name.match(/\d+\s*(?:mm|cm|km)/i)) {
    const m = parseFloat(mMatch[1].replace(',', '.'));
    if (m > 0) return { ppu: product.price / m, unit: 'm', base: m + ' m' };
  }

  // Mass: kg, g
  const kgMatch = name.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
  if (kgMatch) {
    const kg = parseFloat(kgMatch[1].replace(',', '.'));
    if (kg > 0) return { ppu: product.price / kg, unit: 'kg', base: kg + ' kg' };
  }
  const gMatch = name.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
  if (gMatch && !name.match(/\d+\s*kg/i)) {
    const kg = parseFloat(gMatch[1].replace(',', '.')) / 1000;
    if (kg > 0) return { ppu: product.price / kg, unit: 'kg', base: (kg * 1000) + ' g' };
  }

  // Multi-pack: "kit x6", "pack x12", "(x4)", "(par)"
  const packMatch = name.match(/(?:x|pack\s*x?|kit\s*x?)\s*(\d+)/i);
  if (packMatch) {
    const n = parseInt(packMatch[1], 10);
    if (n > 1) return { ppu: product.price / n, unit: 'u.', base: n + ' u.' };
  }
  if (/\(par\)/i.test(name)) {
    return { ppu: product.price / 2, unit: 'u.', base: '2 u.' };
  }

  // Fallback: single unit. Useful for filters, discs, batteries-without-Ah, etc.
  // Shown smaller / dimmer so it doesn't compete with the main price.
  return { ppu: product.price, unit: 'u.', base: '1 u.', singleUnit: true };
};

const formatPPU = (ppu) => {
  if (!ppu) return null;
  if (ppu.singleUnit) return `Precio por unidad`;
  return `${formatCLP(Math.round(ppu.ppu))} / ${ppu.unit}`;
};

const Rating = ({ value, count, size = 12 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <div style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <Icon.Star key={i} size={size} filled={i <= Math.round(value)} />
      ))}
    </div>
    {count != null && <span className="t-xs t-dim">({count})</span>}
  </div>
);

const Logo = ({ size = 24 }) => (
  <img
    src="https://www.implementos.cl/assets/images/logos/new_logo_header.svg"
    alt="Implementos"
    style={{ height: size * 1.5, width: 'auto', display: 'block' }}
  />
);

const Badge = ({ children, kind = 'default' }) => {
  const styles = {
    default: { background: 'var(--surface-3)', color: 'var(--text)' },
    primary: { background: 'var(--primary)', color: '#fff' },
    success: { background: 'rgba(0,210,106,0.15)', color: 'var(--success)' },
    warning: { background: 'rgba(255,176,32,0.15)', color: 'var(--warning)' },
    info: { background: 'rgba(77,163,255,0.15)', color: 'var(--info)' },
    outline: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
      ...styles[kind]
    }}>{children}</span>
  );
};

window.UI = { ProductImg, formatCLP, computePPU, formatPPU, Rating, Logo, Badge };
