// HOME page
const { Logo, formatCLP, Badge, ProductImg, Rating } = window.UI;
const { ProductCard } = window.Catalog;

const HomePage = ({ onNav, vehicle, onOpenVehicle, onAdd }) => {
  const featured = window.MOCK.PRODUCTS.slice(0, 8);
  const newArrivals = window.MOCK.PRODUCTS.slice(4, 8);
  
  // Recently viewed (from localStorage, populated by PDP)
  const [recent, setRecent] = React.useState([]);
  React.useEffect(() => {
    if (!window.getRecentlyViewed) return;
    const ids = window.getRecentlyViewed();
    const products = ids.map(id => window.MOCK.PRODUCTS.find(p => p.id === id)).filter(Boolean).slice(0, 4);
    setRecent(products);
  }, []);
  
  return (
    <div>
      {/* Hero carousel */}
      <window.HeroCarousel onNav={onNav} onOpenVehicle={onOpenVehicle} vehicle={vehicle}/>

      {/* Impact stats bar */}
      <section className="reveal" style={{ background: 'var(--text)', color: 'var(--bg)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { to: 8400, suffix: '+', label: 'Productos en catálogo' },
            { to: 80, suffix: '+', label: 'Marcas oficiales' },
            { to: 12, suffix: '', label: 'Sucursales en Chile' },
            { to: 24, suffix: 'h', label: 'Despacho garantizado' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: 20 }}>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                <span data-counter-to={s.to} data-counter-suffix={s.suffix} data-counter-dur="1600"></span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, letterSpacing: '0.02em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section className="reveal" style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="t-eyebrow t-eyebrow-lined">CATEGORÍAS</div>
            <h2 className="t-h2" style={{ marginTop: 8 }}>Explora por sistema</h2>
          </div>
          <button onClick={() => onNav('category')} className="btn btn-ghost btn-sm">Ver todas <Icon.ChevronRight size={14}/></button>
        </div>
        <div className="reveal-stagger cat-grid-spot" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {window.MOCK.CATEGORIES.map((c, i) => {
            const AnimIcon = window.AnimatedIcons[c.id];
            return (
              <button key={c.id} onClick={() => onNav('category', { cat: c.id })}
                data-cat-id={c.id}
                className="card ai-trigger ai-card-trigger cat-card" style={{ padding: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, aspectRatio: '1', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {c.image ? (
                  <div className="cat-photo-wrap">
                    <div className="cat-photo-glow"></div>
                    <img src={c.image} alt={c.name} className="cat-photo" loading="lazy"/>
                  </div>
                ) : (
                  <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {AnimIcon ? <AnimIcon size={64}/> : <Icon.Package size={20}/>}
                  </div>
                )}
                <div style={{ marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                  <div className="t-sm" style={{ fontWeight: 600, lineHeight: 1.3 }}>{c.name}</div>
                  <div className="t-xs t-dim t-mono" style={{ marginTop: 4 }}>{c.count.toLocaleString('es-CL')} productos</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="reveal" style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>          <div>
            <div className="t-eyebrow t-eyebrow-lined" style={{ color: 'var(--primary)' }}>{vehicle ? `RECOMENDADO PARA TU ${vehicle.brand.toUpperCase()}` : 'MÁS VENDIDOS'}</div>
            <h2 className="t-h2" style={{ marginTop: 8 }}>{vehicle ? 'Compatibles con tu camión' : 'Lo que las flotas eligen'}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm"><Icon.ChevronLeft size={14}/></button>
            <button className="btn btn-secondary btn-sm"><Icon.ChevronRight size={14}/></button>
          </div>
        </div>
        <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd}/>)}
        </div>
      </section>

      {/* Brands */}
      <window.BrandsStrip onNav={onNav}/>

      {/* Stats counters */}
      {window.TrustStripStats && <window.TrustStripStats/>}

      {/* Testimonials */}
      {window.Testimonials && <window.Testimonials/>}

      {/* B2B banner */}
      <section className="reveal" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div className="reveal-left">
            <Badge kind="primary">CUENTAS B2B</Badge>
            <h2 className="t-h2" style={{ marginTop: 16 }}>Tu flota, una cuenta.<br/>Una factura.</h2>
            <p className="t-muted" style={{ marginTop: 12, maxWidth: 480 }}>
              Crédito a 30 días, descuentos por volumen, multi-usuario, órdenes de compra y facturación electrónica integrada.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-primary">Crear cuenta empresa</button>
              <button className="btn btn-secondary">Hablar con ejecutivo</button>
            </div>
          </div>
          <div className="card stripes reveal-right" style={{ padding: 32, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { label: 'Crédito 30 días', icon: Icon.Tag },
                { label: 'Multi-usuario', icon: Icon.User },
                { label: 'OC y Facturación', icon: Icon.Package },
                { label: 'Soporte dedicado', icon: Icon.Shield },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <b.icon size={16}/>
                  </div>
                  <div className="t-sm" style={{ fontWeight: 500 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      {recent.length >= 2 && (
        <section className="reveal" style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <div className="t-eyebrow t-eyebrow-lined">SIGUE DONDE LO DEJASTE</div>
              <h2 className="t-h2" style={{ marginTop: 8 }}>Vistos recientemente</h2>
            </div>
          </div>
          <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {recent.map(p => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd}/>)}
          </div>
        </section>
      )}

      {/* New arrivals */}
      <section className="reveal" style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div className="t-eyebrow t-eyebrow-lined">RECIÉN LLEGADOS</div>
            <h2 className="t-h2" style={{ marginTop: 8 }}>Nuevos en bodega</h2>
          </div>
        </div>
        <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {newArrivals.map(p => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd}/>)}
        </div>
      </section>

      {/* Blog & editorial */}
      <window.BlogSection onNav={onNav}/>

      {/* Trust strip */}
      <section className="reveal" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="reveal-stagger" style={{ maxWidth: 1440, margin: '0 auto', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { icon: Icon.Truck, t: 'Despacho 24h', s: 'Santiago y regiones' },
            { icon: Icon.Shield, t: 'Garantía OEM', s: 'Hasta 24 meses' },
            { icon: Icon.Package, t: 'Retiro en sucursal', s: '12 puntos en Chile' },
            { icon: Icon.Phone, t: 'Soporte técnico', s: 'Lun-Sáb 8:00-20:00' },
          ].map(b => (
            <div key={b.t} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <b.icon size={20}/>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{b.t}</div>
                <div className="t-sm t-muted">{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

window.HomePage = HomePage;
