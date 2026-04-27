// ============================================================
// Conversion layer: testimonials, exit-intent modal, sticky PDP bar,
// compare drawer, wishlist/compare state.
// ============================================================

const { useState, useEffect, useRef } = React;

// ============ Compare + Wishlist state hooks ============
const COMPARE_KEY = 'imp_compare';
const WISH_KEY = 'imp_wishlist';
const readSet = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); } };
const writeSet = (k, s) => localStorage.setItem(k, JSON.stringify([...s]));

function useCompareWishlist() {
  const [compare, setCompare] = useState(() => readSet(COMPARE_KEY));
  const [wishlist, setWishlist] = useState(() => readSet(WISH_KEY));
  const toggleCompare = (id) => {
    setCompare(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      writeSet(COMPARE_KEY, next);
      window.dispatchEvent(new CustomEvent('compare-change', { detail: [...next] }));
      return next;
    });
  };
  const toggleWish = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeSet(WISH_KEY, next);
      return next;
    });
  };
  useEffect(() => {
    const onChange = () => setCompare(readSet(COMPARE_KEY));
    window.addEventListener('compare-change', onChange);
    return () => window.removeEventListener('compare-change', onChange);
  }, []);
  return { compare, wishlist, toggleCompare, toggleWish };
}

// ============ Testimonials section ============
const TESTIMONIALS = [
  {
    quote: 'Llevamos 6 años comprando con Implementos. La compatibilidad por patente nos ahorra horas y los repuestos llegan al día siguiente, sin excepciones.',
    name: 'Rodrigo Salinas',
    role: 'Jefe de Mantención',
    company: 'Transportes Andes Ltda.',
    fleet: '48 camiones · ruta Norte Grande',
    initials: 'RS', tone: '#006DB6',
  },
  {
    quote: 'Migramos toda la flota a su cuenta empresa. Crédito a 30 días, OC integradas con nuestro ERP y descuentos por volumen reales. Cambió la forma en que operamos.',
    name: 'Camila Pérez',
    role: 'Gerenta de Operaciones',
    company: 'Logística Maule',
    fleet: '120 vehículos · distribución regional',
    initials: 'CP', tone: '#7FB935',
  },
  {
    quote: 'El stock por sucursal y la confirmación en tiempo real evitan que parqueemos un camión esperando un repuesto. Lo retiramos directo en Quilicura.',
    name: 'Pedro Maturana',
    role: 'Mecánico Jefe',
    company: 'Servitec Camiones',
    fleet: 'Taller multi-marca · 14 técnicos',
    initials: 'PM', tone: '#FF5B1F',
  },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];
  return (
    <section className="reveal" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 32px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
        <div className="reveal-left">
          <div className="t-eyebrow t-eyebrow-lined">VOCES DE LA FLOTA</div>
          <h2 className="t-h2" style={{ marginTop: 8 }}>Operadores que dependen de la entrega.</h2>
          <p className="t-muted" style={{ marginTop: 14, maxWidth: 420, lineHeight: 1.6 }}>
            Más de 4.200 flotas activas en Chile usan Implementos para mantener sus camiones, buses y maquinaria operando.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Testimonio ${i+1}`}
                style={{
                  width: i === idx ? 32 : 12, height: 4, borderRadius: 2,
                  background: i === idx ? 'var(--primary)' : 'var(--border-strong)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)'
                }}/>
            ))}
          </div>
        </div>
        <div className="card reveal-right" style={{ padding: 40, position: 'relative' }}>
          <svg width="48" height="36" viewBox="0 0 48 36" style={{ color: t.tone, opacity: 0.18, position: 'absolute', top: 28, right: 28 }} fill="currentColor">
            <path d="M0 22.5 C0 11.5 7 2 18 0 L20 6 C13 8 9 13 9 19 H18 V36 H0 Z M28 22.5 C28 11.5 35 2 46 0 L48 6 C41 8 37 13 37 19 H46 V36 H28 Z"/>
          </svg>
          <p style={{ fontSize: 22, lineHeight: 1.5, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text)', textWrap: 'pretty', minHeight: 132 }}>
            "{t.quote}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: t.tone,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16, letterSpacing: '0.02em', flexShrink: 0
            }}>{t.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div className="t-xs t-muted">{t.role} · {t.company}</div>
              <div className="t-xs t-mono t-dim" style={{ marginTop: 3, letterSpacing: '0.02em' }}>{t.fleet}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="btn btn-secondary btn-sm" aria-label="Anterior">
                <Icon.ChevronLeft size={14}/>
              </button>
              <button onClick={() => setIdx((idx + 1) % TESTIMONIALS.length)} className="btn btn-secondary btn-sm" aria-label="Siguiente">
                <Icon.ChevronRight size={14}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ Exit Intent Modal ============
function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(false);
  useEffect(() => {
    if (sessionStorage.getItem('imp_exit_dismissed') === '1') {
      dismissedRef.current = true;
      return;
    }
    const onLeave = (e) => {
      if (dismissedRef.current) return;
      // Trigger when cursor leaves through top of viewport
      if (e.clientY < 10 && e.relatedTarget == null) {
        dismissedRef.current = true;
        setOpen(true);
      }
    };
    // Wait 8s before arming to avoid annoying on quick visits
    const arm = setTimeout(() => {
      document.addEventListener('mouseout', onLeave);
    }, 8000);
    return () => {
      clearTimeout(arm);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);
  const close = () => {
    setOpen(false);
    sessionStorage.setItem('imp_exit_dismissed', '1');
  };
  if (!open) return null;
  return (
    <div className="exit-modal-backdrop" onClick={close}>
      <div className="exit-modal" onClick={e => e.stopPropagation()}>
        <button className="exit-modal-close" onClick={close} aria-label="Cerrar">
          <Icon.Close size={18}/>
        </button>
        <div className="exit-modal-icon">
          <Icon.Truck size={28}/>
        </div>
        <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>ANTES DE QUE TE VAYAS</div>
        <h2 style={{ marginTop: 6 }}>10% off en tu primera compra</h2>
        <p>Aplica a todo el catálogo · sin monto mínimo · vence en 48 horas.</p>
        <div className="exit-modal-code">
          <Icon.Tag size={16}/> FLOTA10
        </div>
        <button className="exit-modal-cta" onClick={close}>
          Quiero usarlo ahora <Icon.ChevronRight size={14} style={{ verticalAlign: '-2px', marginLeft: 4 }}/>
        </button>
        <div className="exit-modal-mini">
          *No acumulable con otras promociones. Cuentas B2B no aplican.
        </div>
      </div>
    </div>
  );
}

// ============ Sticky PDP add-to-cart bar ============
// Reads a target element (the "anchor", the in-page buy box), shows the bar
// only when anchor is scrolled out of view.
function StickyPDPBar({ product, qty = 1, onAdd, anchorSelector = '#pdp-buybox' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!product) return;
    const anchor = document.querySelector(anchorSelector);
    if (!anchor) return;
    const io = new IntersectionObserver(([entry]) => {
      // Show when the anchor is OUT of view (rootMargin biases toward "exited above")
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0, rootMargin: '0px' });
    io.observe(anchor);
    return () => io.disconnect();
  }, [product, anchorSelector]);
  if (!product) return null;
  const { ProductImg, formatCLP } = window.UI;
  return (
    <div className={`pdp-sticky-bar ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <div className="pdp-sticky-thumb">
        <ProductImg kind={product.image}/>
      </div>
      <div className="pdp-sticky-info">
        <div className="pdp-sticky-name">{product.name}</div>
        <div className="pdp-sticky-meta">
          <span className="pdp-sticky-price">{formatCLP(product.price)}</span>
          <span className="t-xs t-dim">·</span>
          <span className="pdp-sticky-stock">{product.brand} · SKU {product.sku}</span>
        </div>
      </div>
      <div className="pdp-sticky-actions">
        <button className="btn btn-secondary btn-sm" aria-label="Comparar">
          <Icon.Compare size={14}/>
        </button>
        <button className="btn btn-secondary btn-sm" aria-label="Favorito">
          <Icon.Heart size={14}/>
        </button>
        <button className="btn btn-primary" onClick={(e) => { window.flyToCart && window.flyToCart(e); onAdd && onAdd(product, qty); }}>
          <Icon.Cart size={14}/> Agregar al carrito
        </button>
      </div>
    </div>
  );
}

// ============ Compare drawer (bottom-floating tray) ============
function CompareDrawer({ onNav }) {
  const [ids, setIds] = useState(() => [...readSet(COMPARE_KEY)]);
  useEffect(() => {
    const onChange = (e) => setIds(e.detail || []);
    window.addEventListener('compare-change', onChange);
    return () => window.removeEventListener('compare-change', onChange);
  }, []);
  if (ids.length === 0) return null;
  const products = ids.map(id => window.MOCK.PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const remove = (id) => {
    const set = readSet(COMPARE_KEY);
    set.delete(id);
    writeSet(COMPARE_KEY, set);
    window.dispatchEvent(new CustomEvent('compare-change', { detail: [...set] }));
  };
  const clearAll = () => {
    writeSet(COMPARE_KEY, new Set());
    window.dispatchEvent(new CustomEvent('compare-change', { detail: [] }));
  };
  const { ProductImg } = window.UI;
  return (
    <div className="compare-drawer" role="region" aria-label="Comparador">
      <div className="compare-drawer-inner">
        <div className="compare-drawer-head">
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>COMPARADOR</div>
            <div className="t-sm" style={{ fontWeight: 600, marginTop: 2 }}>
              {products.length} de 4 productos
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={clearAll} className="btn btn-ghost btn-sm">Limpiar</button>
            <button onClick={() => onNav && onNav('compare')} className="btn btn-primary btn-sm" disabled={products.length < 2}>
              Comparar <Icon.ChevronRight size={12}/>
            </button>
          </div>
        </div>
        <div className="compare-slots">
          {[0,1,2,3].map(slot => {
            const p = products[slot];
            if (!p) {
              return (
                <div key={slot} className="compare-slot is-empty">
                  <Icon.Plus size={18}/>
                  <span className="t-xs">Agregar</span>
                </div>
              );
            }
            return (
              <div key={p.id} className="compare-slot">
                <button className="compare-slot-x" onClick={() => remove(p.id)} aria-label="Quitar">
                  <Icon.Close size={12}/>
                </button>
                <div className="compare-slot-img"><ProductImg kind={p.image}/></div>
                <div className="compare-slot-name">{p.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Testimonials,
  ExitIntentModal,
  StickyPDPBar,
  CompareDrawer,
  useCompareWishlist,
});
