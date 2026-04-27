// ============================================================
// Engagement layer: live activity feed, scroll progress, exit intent,
// recently viewed memory, social proof toasts.
// ============================================================

const { useState, useEffect, useRef } = React;
const Icon = window.Icon;

// ============ Scroll Progress Bar (top of viewport) ============
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        setPct(max > 0 ? (scrolled / max) * 100 : 0);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ transform: `scaleX(${pct / 100})` }}/>
    </div>
  );
}

// ============ Live Activity Toasts ============
// Cycles thru rotating "Pedro de Antofagasta compró Filtro WIX hace 3min"
const ACTIVITY_DATA = [
  { name: 'Pedro M.', city: 'Antofagasta', action: 'compró', item: 'Filtro de aceite WIX', when: 'hace 3 min' },
  { name: 'Constructora del Norte', city: 'Calama', action: 'cotizó', item: '12 baterías Bosch S5', when: 'hace 7 min' },
  { name: 'María L.', city: 'Concepción', action: 'agregó al carro', item: 'Aceite Castrol 15W-40', when: 'hace 2 min' },
  { name: 'Transportes Sur', city: 'Puerto Montt', action: 'compró', item: '4 neumáticos 295/80R22.5', when: 'hace 12 min' },
  { name: 'Carlos T.', city: 'Santiago', action: 'compró', item: 'Kit de embrague Sachs', when: 'hace 5 min' },
  { name: 'Minera Andina', city: 'Copiapó', action: 'cotizó', item: 'Tambor 208L Mobil Delvac', when: 'hace 1 min' },
  { name: 'Javier R.', city: 'Temuco', action: 'compró', item: 'Plumillas Bosch Aerotwin', when: 'hace 8 min' },
  { name: 'Servicio Téc. Lobos', city: 'La Serena', action: 'compró', item: 'Pastillas freno Brembo', when: 'hace 4 min' },
];

function LiveActivityToast({ enabled = true }) {
  const [current, setCurrent] = useState(null);
  const [visible, setVisible] = useState(false);
  const idxRef = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    let timeoutShow, timeoutHide;
    const cycle = () => {
      const item = ACTIVITY_DATA[idxRef.current % ACTIVITY_DATA.length];
      idxRef.current++;
      setCurrent(item);
      setVisible(true);
      timeoutHide = setTimeout(() => setVisible(false), 5500);
      timeoutShow = setTimeout(cycle, 9000);
    };
    const initial = setTimeout(cycle, 4000); // first one 4s after mount
    return () => {
      clearTimeout(initial);
      clearTimeout(timeoutShow);
      clearTimeout(timeoutHide);
    };
  }, [enabled]);
  if (!current || !enabled) return null;
  return (
    <div className={`live-toast ${visible ? 'is-visible' : ''}`} role="status" aria-live="polite">
      <div className="live-toast-dot"></div>
      <div className="live-toast-body">
        <div className="live-toast-title">
          <strong>{current.name}</strong> <span style={{ opacity: 0.7 }}>de {current.city}</span>
        </div>
        <div className="live-toast-sub">
          {current.action} <strong>{current.item}</strong>
        </div>
        <div className="live-toast-when">{current.when}</div>
      </div>
    </div>
  );
}

// ============ Recently Viewed Tracker ============
// Persists viewed product IDs to localStorage
const RV_KEY = 'imp_recently_viewed';
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(RV_KEY) || '[]'); }
  catch { return []; }
}
function trackProductView(productId) {
  const list = getRecentlyViewed().filter(id => id !== productId);
  list.unshift(productId);
  localStorage.setItem(RV_KEY, JSON.stringify(list.slice(0, 8)));
}

// ============ Stat counter (counts up on view) ============
function StatCounter({ to, prefix = '', suffix = '', duration = 1500, decimals = 0 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(to * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const formatted = val.toLocaleString('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

// ============ Trust strip with stats ============
function TrustStripStats() {
  return (
    <div className="trust-strip-stats">
      <div className="trust-stat">
        <div className="trust-stat-num"><StatCounter to={2400} suffix="+"/></div>
        <div className="trust-stat-label">Marcas oficiales</div>
      </div>
      <div className="trust-stat-divider"></div>
      <div className="trust-stat">
        <div className="trust-stat-num"><StatCounter to={180000} suffix="+"/></div>
        <div className="trust-stat-label">SKUs disponibles</div>
      </div>
      <div className="trust-stat-divider"></div>
      <div className="trust-stat">
        <div className="trust-stat-num"><StatCounter to={42} suffix=" años"/></div>
        <div className="trust-stat-label">Acompañando flotas</div>
      </div>
      <div className="trust-stat-divider"></div>
      <div className="trust-stat">
        <div className="trust-stat-num">
          <StatCounter to={98.7} decimals={1} suffix="%"/>
        </div>
        <div className="trust-stat-label">Pedidos a tiempo</div>
      </div>
    </div>
  );
}

// ============ Cart abandonment recovery banner ============
// Shows after 30s on category/PDP if cart has items but user is browsing
function CartRecoveryBanner({ cartCount, onGoToCart }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('imp_recovery_dismissed') === '1';
  });
  useEffect(() => {
    if (cartCount === 0 || dismissed) return;
    const t = setTimeout(() => setShow(true), 25000);
    return () => clearTimeout(t);
  }, [cartCount, dismissed]);
  const onDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('imp_recovery_dismissed', '1');
  };
  if (!show || cartCount === 0 || dismissed) return null;
  return (
    <div className="cart-recovery">
      <div className="cart-recovery-icon">
        <Icon.Cart size={20}/>
      </div>
      <div className="cart-recovery-body">
        <div className="cart-recovery-title">Tienes {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en tu carro</div>
        <div className="cart-recovery-sub">Termina tu compra antes de las 18h y recibe mañana</div>
      </div>
      <button className="cart-recovery-cta" onClick={onGoToCart}>Ver carro</button>
      <button className="cart-recovery-close" onClick={onDismiss} aria-label="Cerrar">
        <Icon.X size={16}/>
      </button>
    </div>
  );
}

Object.assign(window, {
  ScrollProgress,
  LiveActivityToast,
  StatCounter,
  TrustStripStats,
  CartRecoveryBanner,
  trackProductView,
  getRecentlyViewed,
});
