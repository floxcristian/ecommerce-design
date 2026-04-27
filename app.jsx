// Main App
const { Logo } = window.UI;
const { VehicleModal, MiniCart } = window.Catalog;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#006DB6",
  "theme": "dark",
  "density": "comfortable",
  "fontFamily": "Geist",
  "btnStyle": "rounded",
  "view": "desktop",
  "loggedIn": true,
  "liveToasts": true
}/*EDITMODE-END*/;

const FONTS = {
  'Geist': "'Geist', system-ui, sans-serif",
  'Inter': "'Inter', system-ui, sans-serif",
  'IBM Plex Sans': "'IBM Plex Sans', system-ui, sans-serif",
  'Space Grotesk': "'Space Grotesk', system-ui, sans-serif",
  'JetBrains Mono': "'JetBrains Mono', ui-monospace, monospace",
};

const App = () => {
  const [route, setRoute] = React.useState({ name: 'home', params: {} });
  const [vehicle, setVehicle] = React.useState(null);
  const [vehicleModalOpen, setVehicleModalOpen] = React.useState(false);
  const [cart, setCart] = React.useState([]);
  const [miniCartOpen, setMiniCartOpen] = React.useState(false);
  const [store, setStore] = React.useState(window.MOCK.STORES[0]);
  const [storeModalOpen, setStoreModalOpen] = React.useState(false);
  const [tweaks, setTweaks] = window.useTweaks(TWEAK_DEFAULTS);

  const user = tweaks.loggedIn ? {
    name: 'Juan Peña',
    initials: 'JP',
    company: 'Transportes Andes Ltda.',
    role: 'Cuenta Empresa',
    email: 'juan@transportesandes.cl',
  } : null;

  const [address, setAddress] = React.useState({
    id: 'casa',
    label: 'Casa',
    line1: 'Av. Apoquindo 5950, dpto 802',
    commune: 'Las Condes',
    region: 'RM',
  });
  const [addressModalOpen, setAddressModalOpen] = React.useState(false);

  // Apply tweaks to root
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', tweaks.primaryColor);
    // derive primary-soft
    const soft = hexToRgba(tweaks.primaryColor, 0.12);
    root.style.setProperty('--primary-soft', soft);
    root.setAttribute('data-theme', tweaks.theme);
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('data-btn-style', tweaks.btnStyle);
    root.style.setProperty('--font-display', FONTS[tweaks.fontFamily] || FONTS.Geist);
  }, [tweaks]);

  const onNav = (name, params = {}) => {
    setRoute({ name, params });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.__triggerPageTransition) {
      // defer one tick so the new page is mounted before the animation kicks
      requestAnimationFrame(() => window.__triggerPageTransition());
    }
  };

  const onAdd = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    setMiniCartOpen(true);
  };

  const onUpdateCart = (id, qty) => {
    if (qty <= 0) return setCart(prev => prev.filter(i => i.id !== id));
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const onRemoveCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const renderPage = () => {
    const props = { onNav, onAdd, vehicle, onOpenVehicle: () => setVehicleModalOpen(true), density: tweaks.density, store, onOpenStore: () => setStoreModalOpen(true), user };
    switch (route.name) {
      case 'home': return <window.HomePage {...props}/>;
      case 'category': return <window.CategoryPage {...props} catId={route.params.cat}/>;
      case 'pdp': return <window.PDPPage {...props} productId={route.params.productId}/>;
      case 'cart': return <window.CartPage {...props} items={cart} onUpdate={onUpdateCart} onRemove={onRemoveCart}/>;
      case 'checkout': return <window.CheckoutPage {...props} items={cart}/>;
      case 'account': return <window.AccountPage {...props}/>;
      case 'garage': return <window.GaragePage {...props} onSetVehicle={setVehicle}/>;
      case 'compare': return <window.ComparePage {...props}/>;
      case 'brand': return <window.BrandPage {...props} brand={route.params.brandId}/>;
      case 'b2b': return <window.B2BPage {...props}/>;
      default: return <window.HomePage {...props}/>;
    }
  };

  // Mobile view
  if (tweaks.view === 'mobile') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#000' }}>
        <window.IOSDevice>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }} data-screen-label={`Mobile - ${route.name}`}>
            {route.name === 'home' ? (
              <window.MobileApp onNav={onNav} vehicle={vehicle} onOpenVehicle={() => setVehicleModalOpen(true)} cartCount={cartCount} onAdd={onAdd}/>
            ) : (
              <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
                <button onClick={() => onNav('home')} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}><Icon.ChevronLeft size={14}/> Volver</button>
                {renderPage()}
              </div>
            )}
          </div>
        </window.IOSDevice>
        <VehicleModal open={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} onSelect={setVehicle} current={vehicle}/>
        <window.TweaksPanelHost tweaks={tweaks} setTweak={setTweaks}/>
      </div>
    );
  }

  // Promo deadline — 6 days from now (stable for the session)
  const promoDeadline = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 0);
    return d.getTime();
  }, []);
  const [promoCountdown, setPromoCountdown] = React.useState('');
  React.useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, promoDeadline - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setPromoCountdown(`${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [promoDeadline]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} data-screen-label={`Desktop - ${route.name}`}>
      {window.ScrollProgress && <window.ScrollProgress/>}
      <div className="promo-bar">
        <Icon.Bolt size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 8 }}/>
        <strong>Mantención de Otoño</strong>
        <span style={{ margin: '0 10px', opacity: 0.5 }}>·</span>
        Hasta <strong>20% off</strong> en lubricantes y filtros
        <span style={{ margin: '0 10px', opacity: 0.5 }}>·</span>
        <span className="t-xs" style={{ opacity: 0.85, marginRight: 8 }}>Termina en</span>
        <span className="promo-countdown">{promoCountdown || '—'}</span>
      </div>
      <window.Header onNav={onNav} cartCount={cartCount} vehicle={vehicle} onOpenVehicle={() => setVehicleModalOpen(true)} currentRoute={route.name} store={store} onOpenStore={() => setStoreModalOpen(true)} user={user} address={address} onOpenAddress={() => setAddressModalOpen(true)}/>
      <main>{renderPage()}</main>
      <window.Footer/>
      <VehicleModal open={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} onSelect={setVehicle} current={vehicle}/>
      <window.StoreModal open={storeModalOpen} onClose={() => setStoreModalOpen(false)} onSelect={setStore} current={store}/>
      <window.AddressModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} onSelect={setAddress} current={address}/>
      <MiniCart open={miniCartOpen} onClose={() => setMiniCartOpen(false)} items={cart} onUpdate={onUpdateCart} onRemove={onRemoveCart} onCheckout={() => { setMiniCartOpen(false); onNav('checkout'); }}/>
      <window.TweaksPanelHost tweaks={tweaks} setTweak={setTweaks}/>
      {window.LiveActivityToast && <window.LiveActivityToast enabled={tweaks.liveToasts !== false}/>}
      {window.CartRecoveryBanner && <window.CartRecoveryBanner cartCount={cartCount} onGoToCart={() => onNav('cart')}/>}
      {window.ExitIntentModal && <window.ExitIntentModal/>}
      {window.CompareDrawer && <window.CompareDrawer onNav={onNav}/>}
      {window.CategoryPeekHost && <window.CategoryPeekHost onNav={onNav}/>}
    </div>
  );
};

// helper
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Tweaks panel host — wraps the actual panel
const TweaksPanelHost = ({ tweaks, setTweak }) => {
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, TweakToggle } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Vista">
        <TweakRadio label="Dispositivo" value={tweaks.view} onChange={v => setTweak('view', v)} options={[
          { label: 'Desktop', value: 'desktop' },
          { label: 'Mobile', value: 'mobile' },
        ]}/>
        <TweakRadio label="Tema" value={tweaks.theme} onChange={v => setTweak('theme', v)} options={[
          { label: 'Oscuro', value: 'dark' },
          { label: 'Claro', value: 'light' },
        ]}/>
        <TweakRadio label="Sesión" value={tweaks.loggedIn ? 'in' : 'out'} onChange={v => setTweak('loggedIn', v === 'in')} options={[
          { label: 'Logueado', value: 'in' },
          { label: 'Invitado', value: 'out' },
        ]}/>
      </TweakSection>
      <TweakSection title="Marca">
        <TweakColor label="Color primario" value={tweaks.primaryColor} onChange={v => setTweak('primaryColor', v)} swatches={['#006DB6', '#0F4C5C', '#7FB935', '#FF5B1F', '#0066FF', '#7C3AED']}/>
        <TweakSelect label="Tipografía" value={tweaks.fontFamily} onChange={v => setTweak('fontFamily', v)} options={[
          { label: 'Geist (default)', value: 'Geist' },
          { label: 'Inter', value: 'Inter' },
          { label: 'IBM Plex Sans', value: 'IBM Plex Sans' },
          { label: 'Space Grotesk', value: 'Space Grotesk' },
          { label: 'JetBrains Mono', value: 'JetBrains Mono' },
        ]}/>
      </TweakSection>
      <TweakSection title="Componentes">
        <TweakRadio label="Botones" value={tweaks.btnStyle} onChange={v => setTweak('btnStyle', v)} options={[
          { label: 'Sharp', value: 'sharp' },
          { label: 'Round', value: 'rounded' },
          { label: 'Pill', value: 'pill' },
          { label: 'Industrial', value: 'industrial' },
        ]}/>
        <TweakRadio label="Densidad grid" value={tweaks.density} onChange={v => setTweak('density', v)} options={[
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ]}/>
      </TweakSection>
      <TweakSection title="Engagement">
        <TweakToggle label="Live activity toasts" value={tweaks.liveToasts !== false} onChange={v => setTweak('liveToasts', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
};

window.TweaksPanelHost = TweaksPanelHost;
window.App = App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
