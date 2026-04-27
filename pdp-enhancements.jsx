// PDP enhancements — zoom gallery, bundle, Q&A, shipping calc, seller trust.
// Each piece is exposed on window.PDPx so page-pdp.jsx can drop them in.
const { formatCLP, computePPU, formatPPU, ProductImg, Badge, Rating } = window.UI;

// ────────────────────────────────────────────────────────────────────────────
// 1) Zoom gallery — hover desktop reveals a magnified inset (lens + 2x viewer)
// ────────────────────────────────────────────────────────────────────────────
const ZoomGallery = ({ kind, badge }) => {
  const ref = React.useRef(null);
  const [zoom, setZoom] = React.useState(null); // {x, y} as 0..1
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) setZoom({ x, y });
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setZoom(null)}
      className="card pdpx-zoom-stage"
      style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative', cursor: zoom ? 'zoom-in' : 'default' }}
    >
      <ProductImg kind={kind}/>
      {badge && <div style={{ position: 'absolute', top: 16, left: 16 }}><Badge kind="primary">{badge}</Badge></div>}

      {/* lens */}
      {zoom && (
        <div className="pdpx-lens" style={{
          left: `calc(${zoom.x * 100}% - 60px)`,
          top: `calc(${zoom.y * 100}% - 60px)`,
        }}/>
      )}

      {/* zoom viewer (overlay on the right outside) */}
      {zoom && (
        <div className="pdpx-zoom-viewer">
          <div style={{
            width: '100%', height: '100%',
            transform: `scale(2.4)`,
            transformOrigin: `${zoom.x * 100}% ${zoom.y * 100}%`,
          }}>
            <ProductImg kind={kind}/>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 8, zIndex: 2 }}>
        <button className="btn btn-secondary btn-sm" style={{ background: 'var(--bg-elevated)' }}><Icon.Heart size={14}/></button>
        <button className="btn btn-secondary btn-sm" style={{ background: 'var(--bg-elevated)' }}><Icon.Compare size={14}/></button>
      </div>

      <div className="pdpx-zoom-hint t-xs t-mono">
        <Icon.Plus size={10}/> PASA EL CURSOR PARA HACER ZOOM
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 2) Frequently-bought-together bundle
// ────────────────────────────────────────────────────────────────────────────
const BundleSection = ({ product, onAdd }) => {
  const all = window.MOCK.PRODUCTS;
  // Pick 2 complementary items from same category but different brand, deterministic
  const same = all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 1);
  const other = all.filter(p => p.id !== product.id && (!same[0] || p.id !== same[0].id)).slice(0, 1);
  const bundle = [product, ...same, ...other].filter(Boolean).slice(0, 3);

  const [picked, setPicked] = React.useState(bundle.map(() => true));
  const subtotal = bundle.reduce((s, p, i) => picked[i] ? s + p.price : s, 0);
  const bundleDiscount = picked.filter(Boolean).length >= 3 ? 0.08 : picked.filter(Boolean).length >= 2 ? 0.04 : 0;
  const total = Math.round(subtotal * (1 - bundleDiscount));
  const saved = subtotal - total;

  const addAll = () => {
    bundle.forEach((p, i) => picked[i] && onAdd(p, 1));
  };

  return (
    <div style={{ marginTop: 56 }}>
      <div className="t-eyebrow">COMPRAR EN CONJUNTO</div>
      <h2 className="t-h2" style={{ marginTop: 8, marginBottom: 4 }}>Combo recomendado</h2>
      <p className="t-muted" style={{ marginBottom: 24, fontSize: 14 }}>
        Mecánicos suelen reemplazar estos componentes en la misma intervención. Llévalos juntos y ahorra hasta 8%.
      </p>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bundle.length}, 1fr) auto auto`, gap: 16, alignItems: 'center' }}>
          {bundle.map((p, i) => (
            <React.Fragment key={p.id}>
              <div style={{ position: 'relative' }}>
                <label style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${picked[i] ? 'var(--primary)' : 'var(--border-strong)'}`,
                    background: picked[i] ? 'var(--primary)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {picked[i] && <Icon.Check size={9}/>}
                  </span>
                  <input type="checkbox" checked={picked[i]} onChange={() => setPicked(p2 => p2.map((v, idx) => idx === i ? !v : v))} style={{ display: 'none' }}/>
                </label>
                <div style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', opacity: picked[i] ? 1 : 0.45, transition: 'opacity 0.2s' }}>
                  <ProductImg kind={p.image}/>
                </div>
                <div className="t-xs t-mono t-dim" style={{ marginTop: 8, letterSpacing: '0.04em' }}>{p.brand.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>{formatCLP(p.price)}</div>
              </div>
              {i < bundle.length - 1 && <div style={{ fontSize: 28, color: 'var(--text-dim)', textAlign: 'center' }}>+</div>}
            </React.Fragment>
          ))}

          <div style={{ fontSize: 28, color: 'var(--text-dim)', textAlign: 'center' }}>=</div>

          <div style={{ minWidth: 220, paddingLeft: 16, borderLeft: '1px solid var(--border)' }}>
            <div className="t-xs t-mono t-dim" style={{ letterSpacing: '0.04em' }}>TOTAL COMBO</div>
            <div className="t-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>{formatCLP(total)}</div>
            {saved > 0 && (
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="t-xs t-dim" style={{ textDecoration: 'line-through' }}>{formatCLP(subtotal)}</span>
                <Badge kind="success">Ahorras {formatCLP(saved)}</Badge>
              </div>
            )}
            <button onClick={addAll} className="btn btn-primary btn-block" style={{ marginTop: 14 }} disabled={picked.filter(Boolean).length === 0}>
              <Icon.Cart size={14}/> Agregar combo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 3) Shipping calculator — postal code → ETA + price
// ────────────────────────────────────────────────────────────────────────────
const REGIONS = [
  { code: '83', name: 'Santiago', eta: 'Mañana mar 28 abr', price: 0, free: true, kind: 'express' },
  { code: '85', name: 'Quilicura / Pudahuel', eta: 'Hoy entre 18:00 y 22:00', price: 4990, free: false, kind: 'sameday' },
  { code: '13', name: 'Valparaíso / Viña', eta: 'Mié 29 abr', price: 5990, free: false, kind: 'standard' },
  { code: '23', name: 'Antofagasta', eta: 'Vie 1 may', price: 14990, free: false, kind: 'longhaul' },
  { code: '5', name: 'Concepción', eta: 'Jue 30 abr', price: 7990, free: false, kind: 'standard' },
  { code: '25', name: 'Temuco', eta: 'Vie 1 may', price: 9990, free: false, kind: 'standard' },
  { code: '14', name: 'Punta Arenas', eta: 'Lun 4 may', price: 24990, free: false, kind: 'longhaul' },
];

const ShippingCalculator = ({ product }) => {
  const [code, setCode] = React.useState('');
  const [match, setMatch] = React.useState(null);
  const [searched, setSearched] = React.useState(false);

  const search = () => {
    const q = code.trim();
    if (!q) return;
    const m = REGIONS.find(r => r.code === q.slice(0, 2)) || REGIONS.find(r => r.name.toLowerCase().includes(q.toLowerCase())) || REGIONS[0];
    setMatch(m);
    setSearched(true);
  };

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Icon.Truck size={16}/>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Calcula tu envío</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          placeholder="Código postal o comuna"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{ fontSize: 13 }}
        />
        <button onClick={search} className="btn btn-secondary btn-sm" style={{ padding: '0 16px' }}>Calcular</button>
      </div>

      {searched && match && (
        <div style={{ marginTop: 14, padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, animation: 'pdpx-slide-in 0.25s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div className="t-xs t-mono t-dim" style={{ letterSpacing: '0.04em' }}>{match.name.toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{match.eta}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="t-xs t-mono t-dim">ENVÍO</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: match.free ? 'var(--success)' : 'var(--text)', marginTop: 2 }}>
                {match.free ? 'GRATIS' : formatCLP(match.price)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            {match.kind === 'sameday' && <><Icon.Bolt size={12}/><span className="t-xs">Despacho en el día — pide antes de las 16:00</span></>}
            {match.kind === 'express' && <><Icon.Check size={12}/><span className="t-xs">Envío express incluido en compras sobre $50.000</span></>}
            {match.kind === 'standard' && <><Icon.Package size={12}/><span className="t-xs">Despacho estándar con seguimiento en línea</span></>}
            {match.kind === 'longhaul' && <><Icon.Truck size={12}/><span className="t-xs">Despacho a regiones extremas — coordinación con courier</span></>}
          </div>
        </div>
      )}

      {!searched && (
        <div className="t-xs t-dim" style={{ marginTop: 10 }}>Prueba: <button onClick={() => { setCode('Antofagasta'); }} style={{ textDecoration: 'underline', color: 'var(--text-muted)' }}>Antofagasta</button> · <button onClick={() => { setCode('Quilicura'); }} style={{ textDecoration: 'underline', color: 'var(--text-muted)' }}>Quilicura</button></div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 4) Q&A — ask the community / seller
// ────────────────────────────────────────────────────────────────────────────
const QA_SEED = [
  {
    q: '¿Sirve para Mercedes Actros 2545 año 2021?',
    a: 'Sí, está homologado para toda la familia Actros con motor OM 471. Confirmado por nuestro equipo técnico.',
    asker: 'Rodrigo M.',
    answerer: 'Equipo Implementos',
    askedAt: 'hace 2 días',
    answeredAt: 'hace 1 día',
    helpful: 14,
    verified: true,
  },
  {
    q: '¿Es OEM o aftermarket?',
    a: 'Es OEM original Bosch, mismo proveedor que abastece a fábrica. Trae sello de fábrica y trazabilidad.',
    asker: 'Felipe C.',
    answerer: 'Equipo Implementos',
    askedAt: 'hace 5 días',
    answeredAt: 'hace 5 días',
    helpful: 32,
    verified: true,
  },
  {
    q: '¿Lo despachan a Calama el mismo día?',
    a: 'A Calama llega en 48-72h vía courier asociado. Si pides antes de las 14:00, sale el mismo día desde bodega Santiago.',
    asker: 'Cristián V.',
    answerer: 'Implementos Operaciones',
    askedAt: 'hace 1 semana',
    answeredAt: 'hace 6 días',
    helpful: 8,
    verified: true,
  },
];

const QASection = ({ product }) => {
  const [showForm, setShowForm] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Preguntas y respuestas</div>
          <div className="t-xs t-muted">Respondemos en menos de 24h hábiles</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-secondary btn-sm">
          <Icon.Plus size={12}/> Hacer una pregunta
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Ej: ¿Es compatible con Volvo FH 460 año 2020?"
            rows={3}
            className="input"
            style={{ resize: 'vertical', fontSize: 13, fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span className="t-xs t-muted">Tu pregunta será visible para otros compradores.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowForm(false); setDraft(''); }} className="btn btn-ghost btn-sm">Cancelar</button>
              <button onClick={() => { setShowForm(false); setDraft(''); }} className="btn btn-primary btn-sm" disabled={!draft.trim()}>Publicar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {QA_SEED.map((item, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>P</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{item.q}</div>
                <div className="t-xs t-dim" style={{ marginTop: 2 }}>{item.asker} · {item.askedAt}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingLeft: 32, borderLeft: '2px solid var(--primary)', marginLeft: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{item.a}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span className="t-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
                    {item.verified && <Icon.Check size={11}/>}
                    {item.answerer}
                  </span>
                  <span className="t-xs t-dim">· {item.answeredAt}</span>
                  <span style={{ flex: 1 }}/>
                  <button className="t-xs" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon.ThumbsUp size={11}/> Útil ({item.helpful})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Ver las 24 preguntas <Icon.ChevronDown size={12}/></button>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 5) Seller / trust card
// ────────────────────────────────────────────────────────────────────────────
const TrustCard = () => (
  <div className="card" style={{ padding: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary), black 25%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Shield size={18} style={{ color: 'white' }}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          Vendido por Implementos
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: 'rgba(0,210,106,0.12)', color: 'var(--success)', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>
            <Icon.Check size={9}/> VERIFICADO
          </span>
        </div>
        <div className="t-xs t-muted" style={{ marginTop: 2 }}>16 años · 142.000 envíos completados</div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
      {[
        { v: '4.9', l: 'Calidad' },
        { v: '99%', l: 'A tiempo' },
        { v: '<2h', l: 'Respuesta' },
      ].map(s => (
        <div key={s.l} style={{ textAlign: 'center' }}>
          <div className="t-mono" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.v}</div>
          <div className="t-xs t-dim" style={{ marginTop: 2 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// 6) Volume tier picker — qty buttons that show price impact live
// ────────────────────────────────────────────────────────────────────────────
const VolumeQtyPicker = ({ product, qty, setQty }) => {
  const tiers = window.MOCK.computeVolumeTiers(product);
  if (!tiers) return null;
  const activeTier = tiers.find(t => qty >= t.min && (t.max == null || qty <= t.max));
  const nextTier = tiers.find(t => t.min > qty);
  const toNext = nextTier ? nextTier.min - qty : 0;

  return (
    <div style={{ marginTop: 12, padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
      <div className="t-xs t-mono t-dim" style={{ letterSpacing: '0.04em', marginBottom: 8 }}>SALTOS DE PRECIO POR VOLUMEN</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiers.length}, 1fr)`, gap: 6 }}>
        {tiers.map((t, i) => {
          const isActive = activeTier && t.min === activeTier.min;
          const label = t.max == null ? `${t.min}+` : t.min === t.max ? `${t.min}` : `${t.min}-${t.max}`;
          return (
            <button
              key={i}
              onClick={() => setQty(t.min)}
              className="pdpx-tier"
              data-active={isActive ? 'true' : 'false'}
            >
              <div className="t-xs t-mono" style={{ fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{formatCLP(t.price)}</div>
              {t.discount > 0 && <div className="t-xs" style={{ color: 'var(--success)', marginTop: 2 }}>-{Math.round(t.discount * 100)}%</div>}
              {t.discount === 0 && <div className="t-xs t-dim" style={{ marginTop: 2 }}>—</div>}
            </button>
          );
        })}
      </div>
      {nextTier && toNext > 0 && (
        <div className="t-xs" style={{ marginTop: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Bolt size={11}/>
          Lleva <strong style={{ color: 'var(--text)' }}>{toNext} más</strong> y baja a <strong style={{ color: 'var(--success)' }}>{formatCLP(nextTier.price)}</strong> c/u
        </div>
      )}
    </div>
  );
};

window.PDPx = { ZoomGallery, BundleSection, ShippingCalculator, QASection, TrustCard, VolumeQtyPicker };
