// Mobile view of Implementos
const { Logo, formatCLP, Badge, ProductImg, Rating } = window.UI;

const MobileApp = ({ onNav, vehicle, onOpenVehicle, cartCount, onAdd }) => {
  const [tab, setTab] = React.useState('home');
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Mobile Header */}
      <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={22}/>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-ghost btn-sm"><Icon.Heart size={18}/></button>
        <button onClick={() => onNav('cart')} className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
          <Icon.Cart size={18}/>
          {cartCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--primary)', color: '#fff', fontSize: 9, fontWeight: 700, minWidth: 14, height: 14, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{cartCount}</span>}
        </button>
      </header>

      {/* Search bar */}
      <div style={{ padding: 12, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setShowSearch(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
          <Icon.Search size={14}/>
          <span className="t-sm t-muted">Busca SKU, producto, marca…</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Vehicle banner */}
        <button onClick={onOpenVehicle} style={{ width: '100%', padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: vehicle ? 'var(--primary-soft)' : 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon.Truck size={16}/>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div className="t-xs t-mono" style={{ color: vehicle ? 'var(--primary)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {vehicle ? 'MI VEHÍCULO ACTIVO' : 'SELECCIONAR VEHÍCULO'}
            </div>
            <div className="t-sm" style={{ fontWeight: 600, marginTop: 2 }}>
              {vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'Filtra por compatibilidad'}
            </div>
          </div>
          <Icon.ChevronRight size={14}/>
        </button>

        {/* Hero */}
        <div style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>+58.000 SKUs · ENVÍO 24H</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginTop: 8, marginBottom: 8 }}>
            Repuestos para flotas que <span style={{ color: 'var(--primary)' }}>no paran.</span>
          </h1>
          <p className="t-sm t-muted" style={{ marginBottom: 12 }}>Marcas OEM, despacho garantizado.</p>
          <button onClick={() => onNav('category')} className="btn btn-primary btn-block btn-lg">Ver catálogo <Icon.ChevronRight size={14}/></button>
        </div>

        {/* Categories */}
        <div style={{ padding: '8px 16px 16px' }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>CATEGORÍAS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {window.MOCK.CATEGORIES.slice(0, 9).map(c => {
            const AnimIcon = window.AnimatedIcons?.[c.id];
            return (
              <button key={c.id} onClick={() => onNav('category', { cat: c.id })} className="card ai-trigger ai-card-trigger" style={{ padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, aspectRatio: 1, textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {AnimIcon ? <AnimIcon size={36}/> : <Icon.Package size={14}/>}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div className="t-xs" style={{ fontWeight: 600, lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: 2 }}>{c.count}</div>
                </div>
              </button>
            );
          })}
          </div>
        </div>

        {/* Featured products */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>MÁS VENDIDOS</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Lo que las flotas eligen</h2>
            </div>
            <button className="btn btn-ghost btn-sm">Ver todo</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {window.MOCK.PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} className="card" onClick={() => onNav('pdp', { productId: p.id })} style={{ overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ aspectRatio: 1, position: 'relative', borderBottom: '1px solid var(--border)' }}>
                  <ProductImg kind={p.image}/>
                  {p.fitsVehicle && (
                    <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 6px', background: 'rgba(0,210,106,0.15)', borderRadius: 4, fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>✓ COMPAT</div>
                  )}
                </div>
                <div style={{ padding: 10 }}>
                  <div className="t-xs t-mono t-dim">{p.brand.toUpperCase()}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4, lineHeight: 1.3, minHeight: 32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' }}>{formatCLP(p.price)}</div>
                  <button onClick={(e) => { e.stopPropagation(); onAdd(p); }} className="btn btn-primary btn-block btn-sm" style={{ marginTop: 8 }}><Icon.Plus size={12}/> Agregar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B2B card */}
        <div style={{ padding: 16 }}>
          <div className="card stripes" style={{ padding: 20 }}>
            <Badge kind="primary">CUENTA B2B</Badge>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12, lineHeight: 1.2 }}>Tu flota, una cuenta. Una factura.</h3>
            <p className="t-sm t-muted" style={{ marginTop: 6 }}>Crédito 30 días, multi-usuario, OC integrada.</p>
            <button className="btn btn-secondary btn-block btn-sm" style={{ marginTop: 12 }}>Crear cuenta empresa</button>
          </div>
        </div>
        <div style={{ height: 80 }}></div>
      </div>

      {/* Bottom tab bar */}
      <nav style={{ display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', padding: '8px 0 24px' }}>
        {[
          { k: 'home', l: 'Inicio', i: Icon.Menu, r: 'home' },
          { k: 'category', l: 'Catálogo', i: Icon.Grid, r: 'category' },
          { k: 'garage', l: 'Garage', i: Icon.Garage, r: 'garage' },
          { k: 'cart', l: 'Carrito', i: Icon.Cart, r: 'cart' },
          { k: 'account', l: 'Cuenta', i: Icon.User, r: 'account' },
        ].map(t => (
          <button key={t.k} onClick={() => { setTab(t.k); onNav(t.r); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', color: tab === t.k ? 'var(--primary)' : 'var(--text-muted)', position: 'relative' }}>
            {tab === t.k && <div style={{ position: 'absolute', top: 0, width: 32, height: 2, background: 'var(--primary)' }}></div>}
            <t.i size={18}/>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{t.l}</span>
          </button>
        ))}
      </nav>

      {/* Search overlay */}
      {showSearch && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 30, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setShowSearch(false)} className="btn btn-ghost btn-sm"><Icon.ChevronLeft size={16}/></button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--primary)', borderRadius: 8, padding: '10px 12px' }}>
              <Icon.Search size={14}/>
              <input autoFocus placeholder="Buscar repuestos…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }}/>
            </div>
          </div>
          <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>BÚSQUEDAS RECIENTES</div>
            {['Filtro aceite Bosch', 'Pastillas Brembo', 'Castrol 15W-40', 'Bujías NGK'].map(t => (
              <button key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', width: '100%', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <Icon.Search size={14}/>
                <span className="t-sm" style={{ flex: 1 }}>{t}</span>
                <Icon.ChevronRight size={12}/>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.MobileApp = MobileApp;
