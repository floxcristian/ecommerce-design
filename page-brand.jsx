// BRAND PAGE — landing for a single manufacturer (Bosch, Stanley, etc.)
const { ProductImg, formatCLP, Badge } = window.UI;
const { ProductCard } = window.Catalog;

// Brand metadata — visual identity per brand
const BRAND_DATA = {
  'Bosch': {
    color: '#EE0000',
    accent: '#003366',
    tagline: 'Tecnología alemana para tu flota',
    heroDesc: 'Líder mundial en componentes automotrices. Desde 1886, Bosch fabrica piezas con la precisión que exigen las flotas profesionales.',
    founded: 1886,
    countries: 60,
    employees: '420.000',
    categories: ['filtros', 'electrico', 'frenos', 'accesorios'],
    bestSellers: ['p001', 'p012', 'p008'],
    certifications: ['OEM', 'ISO 9001', 'IATF 16949'],
    awards: 'Premio J.D. Power 2024 · Calidad inicial',
  },
  'Castrol': {
    color: '#00833D',
    accent: '#E30613',
    tagline: 'Aceites premium para motores diésel',
    heroDesc: 'Castrol Vecton: la línea profesional para motores Euro V/VI. Intervalos extendidos de cambio, máxima protección.',
    founded: 1899,
    countries: 150,
    employees: '15.000',
    categories: ['lubricantes'],
    bestSellers: ['p002', 'p009'],
    certifications: ['API CK-4', 'ACEA E9', 'JASO DH-2'],
    awards: 'Aprobado por Mercedes-Benz, Volvo, MAN',
  },
  'Brembo': {
    color: '#CC092F',
    accent: '#000000',
    tagline: 'Frenos de competición para tu día a día',
    heroDesc: 'Especialistas italianos en sistemas de freno desde 1961. Equipo original de Ferrari, Porsche y los mejores camiones.',
    founded: 1961,
    countries: 70,
    employees: '14.000',
    categories: ['frenos'],
    bestSellers: ['p003'],
    certifications: ['OEM Premium', 'ECE R90'],
    awards: 'Frenos oficiales F1 desde 1975',
  },
};

const BrandPage = ({ onNav, onAdd, vehicle, density, brandId, store }) => {
  const brand = brandId || 'Bosch';
  const meta = BRAND_DATA[brand] || BRAND_DATA['Bosch'];
  const products = window.MOCK.PRODUCTS.filter(p => p.brand === brand);
  const allCategories = window.MOCK.CATEGORIES.filter(c => meta.categories.includes(c.id));

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Brand hero — full bleed with brand color */}
      <div style={{ background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.accent} 100%)`, color: '#fff', padding: '48px 32px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 20px)` }}/>

        <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative' }}>
          <div className="t-xs t-mono" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, letterSpacing: '0.04em', opacity: 0.8 }}>
            <button onClick={() => onNav('home')}>INICIO</button>
            <Icon.ChevronRight size={10}/>
            <span>MARCAS</span>
            <Icon.ChevronRight size={10}/>
            <span style={{ opacity: 1 }}>{brand.toUpperCase()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              {/* Brand logotype */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 18px', background: '#fff', color: meta.color, borderRadius: 8, marginBottom: 24, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>
                {brand.toUpperCase()}
              </div>
              <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.02em' }}>{meta.tagline}</h1>
              <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 580, lineHeight: 1.5, marginBottom: 24 }}>{meta.heroDesc}</p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => document.getElementById('brand-products')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-lg" style={{ background: '#fff', color: meta.color, fontWeight: 700 }}>
                  Ver productos {brand}
                </button>
                <button className="btn btn-lg" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                  <Icon.Download size={14}/> Catálogo PDF
                </button>
              </div>

              {/* Stats strip */}
              <div style={{ display: 'flex', gap: 32, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{meta.founded}</div>
                  <div className="t-xs t-mono" style={{ opacity: 0.7, marginTop: 4 }}>FUNDACIÓN</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{meta.countries}+</div>
                  <div className="t-xs t-mono" style={{ opacity: 0.7, marginTop: 4 }}>PAÍSES</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{products.length}</div>
                  <div className="t-xs t-mono" style={{ opacity: 0.7, marginTop: 4 }}>SKU EN CHILE</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{meta.employees}</div>
                  <div className="t-xs t-mono" style={{ opacity: 0.7, marginTop: 4 }}>EMPLEADOS</div>
                </div>
              </div>
            </div>

            {/* Hero product showcase */}
            <div style={{ position: 'relative', height: 380 }}>
              {products.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{
                  position: 'absolute',
                  width: 220,
                  height: 220,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 20px 60px -10px rgba(0,0,0,0.3)',
                  transform: `translate(${i * 60 - 60}px, ${i * 30 - 30}px) rotate(${(i - 1) * 4}deg)`,
                  zIndex: 3 - i,
                  border: '4px solid #fff',
                }}>
                  <ProductImg kind={p.image}/>
                </div>
              ))}
              {/* Sticker */}
              <div style={{ position: 'absolute', top: 20, right: 20, width: 110, height: 110, borderRadius: '50%', background: '#fff', color: meta.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 800, transform: 'rotate(-12deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 10 }}>
                <span style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>HASTA</span>
                <span style={{ fontSize: 28, lineHeight: 1 }}>20%</span>
                <span style={{ fontSize: 11, marginTop: 2 }}>OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { icon: 'Shield', t: '100% original', s: `Distribuidor oficial ${brand}` },
            { icon: 'Truck', t: 'Stock en Chile', s: 'Despacho 24-48h' },
            { icon: 'Award', t: meta.awards, s: 'Reconocimiento global' },
            { icon: 'Headset', t: 'Asesoría experta', s: 'Especialistas certificados' },
          ].map(b => {
            const I = Icon[b.icon] || Icon.Check;
            return (
              <div key={b.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: meta.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I size={16}/>
                </div>
                <div>
                  <div className="t-sm" style={{ fontWeight: 600 }}>{b.t}</div>
                  <div className="t-xs t-muted">{b.s}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <div className="t-eyebrow" style={{ color: meta.color }}>EXPLORA POR CATEGORÍA</div>
          <h2 className="t-h2" style={{ fontSize: 28, marginTop: 4 }}>Productos {brand}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
          {allCategories.map(c => (
            <button key={c.id} onClick={() => onNav('category', { cat: c.id })} className="card lift" style={{ padding: 20, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${meta.color}15`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon.Box size={18}/>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div className="t-xs t-muted" style={{ marginTop: 2 }}>{Math.floor(c.count / 8)} productos</div>
            </button>
          ))}
        </div>

        {/* Bestsellers */}
        <div id="brand-products" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div className="t-eyebrow" style={{ color: meta.color }}>TOP VENTAS</div>
            <h2 className="t-h2" style={{ fontSize: 28, marginTop: 4 }}>Los favoritos de las flotas</h2>
          </div>
          <button onClick={() => onNav('category')} className="btn btn-secondary">
            Ver todos ({products.length}) <Icon.ChevronRight size={14}/>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(var(--grid-min), 1fr))`, gap: 16, marginBottom: 48 }}>
          {products.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} density={density}/>
          ))}
        </div>

        {/* About brand — split column */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: 40, background: meta.color, color: '#fff' }}>
              <div className="t-eyebrow" style={{ opacity: 0.7, marginBottom: 8 }}>POR QUÉ {brand.toUpperCase()}</div>
              <h3 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>Calidad sin atajos.<br/>Garantía sin letra chica.</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Pieza original con número de serie verificable',
                  'Garantía oficial del fabricante: 12-24 meses',
                  'Stock real en bodega Santiago',
                  'Soporte técnico directo de fábrica',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon.Check size={18} style={{ flexShrink: 0, marginTop: 2 }}/>
                    <span style={{ fontSize: 14, opacity: 0.95 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 40 }}>
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>CERTIFICACIONES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {meta.certifications.map(c => (
                  <span key={c} style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c}</span>
                ))}
              </div>
              <div className="t-eyebrow" style={{ marginBottom: 14 }}>SOPORTE TÉCNICO</div>
              <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, marginBottom: 12 }}>
                <div className="t-sm" style={{ fontWeight: 600, marginBottom: 4 }}>Hotline {brand}</div>
                <div className="t-mono t-sm" style={{ color: 'var(--primary)' }}>+56 2 2840 5500</div>
                <div className="t-xs t-muted">Lun a Vie · 8:00 a 18:00</div>
              </div>
              <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8 }}>
                <div className="t-sm" style={{ fontWeight: 600, marginBottom: 4 }}>Manuales y diagramas</div>
                <button className="t-sm" style={{ color: 'var(--primary)', fontWeight: 600 }}>Descargar biblioteca →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Other brands */}
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>OTRAS MARCAS PREMIUM</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {window.MOCK.BRANDS.slice(0, 12).filter(b => b !== brand).map(b => (
            <button key={b} onClick={() => onNav('brand', { brandId: b })} className="card lift" style={{ padding: 18, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{b}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.BrandPage = BrandPage;
window.BRAND_DATA = BRAND_DATA;
