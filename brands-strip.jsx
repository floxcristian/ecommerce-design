// Brands strip — typographic wordmarks (no copyrighted logos)
// Grayscale by default, color on hover; click filters catalog by brand.
const BRANDS = [
  { name: 'Bosch',       wordmark: 'BOSCH',         style: { fontFamily: 'Geist, sans-serif', fontWeight: 800, letterSpacing: '0.02em' }, accent: '#E2231A' },
  { name: 'Shell',       wordmark: 'Shell',         style: { fontFamily: 'Geist, sans-serif', fontWeight: 700, letterSpacing: '-0.01em' }, accent: '#FBCE07' },
  { name: 'Mobil',       wordmark: 'Mobil',         style: { fontFamily: 'Geist, sans-serif', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em' }, accent: '#003DA5' },
  { name: 'Castrol',     wordmark: 'CASTROL',       style: { fontFamily: 'Geist, sans-serif', fontWeight: 800, letterSpacing: '0.04em' }, accent: '#00853F' },
  { name: 'Brembo',      wordmark: 'brembo',        style: { fontFamily: 'Geist, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }, accent: '#E2001A' },
  { name: 'Mann-Filter', wordmark: 'MANN-FILTER',   style: { fontFamily: 'Geist, sans-serif', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.85em' }, accent: '#FFB81C' },
  { name: 'Michelin',    wordmark: 'MICHELIN',      style: { fontFamily: 'Geist, sans-serif', fontWeight: 800, letterSpacing: '0.04em' }, accent: '#0033A0' },
  { name: 'Varta',       wordmark: 'VARTA',         style: { fontFamily: 'Geist, sans-serif', fontWeight: 900, letterSpacing: '0.04em' }, accent: '#003DA5' },
  { name: 'NGK',         wordmark: 'NGK',           style: { fontFamily: 'Geist, sans-serif', fontWeight: 900, letterSpacing: '0.06em' }, accent: '#E2231A' },
  { name: 'Sachs',       wordmark: 'SACHS',         style: { fontFamily: 'Geist, sans-serif', fontWeight: 800, letterSpacing: '0.04em' }, accent: '#003DA5' },
  { name: 'TRW',         wordmark: 'TRW',           style: { fontFamily: 'Geist, sans-serif', fontWeight: 900, letterSpacing: '0.06em' }, accent: '#C8102E' },
  { name: 'Continental', wordmark: 'Continental',   style: { fontFamily: 'Geist, sans-serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '0.95em' }, accent: '#FFA500' },
];

const BrandsStrip = ({ onNav }) => {
  return (
    <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="t-eyebrow">PARTNERS OEM</div>
            <h2 className="t-h2" style={{ marginTop: 8 }}>Las marcas que mantienen tu flota.</h2>
            <p className="t-body t-muted" style={{ marginTop: 8, maxWidth: 560, fontSize: 15 }}>
              Más de 80 marcas oficiales con repuestos OEM y aftermarket de calidad equivalente. Garantía respaldada de fábrica.
            </p>
          </div>
          <button onClick={() => onNav('category')} className="btn btn-secondary btn-sm">
            Ver todas las marcas <Icon.ChevronRight size={14}/>
          </button>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <button
                key={`${b.name}-${i}`}
                onClick={() => onNav('brand', { brandId: b.name })}
                className="brand-tile"
                title={`Ver productos ${b.name}`}
                style={{ '--brand-accent': b.accent, flex: '0 0 200px', height: 100 }}
              >
                <span className="brand-wordmark" style={b.style}>{b.wordmark}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Icon.Shield size={16} style={{ color: 'var(--primary)', flexShrink: 0 }}/>
          <div className="t-sm" style={{ flex: 1, minWidth: 240 }}>
            <strong>Implementos es distribuidor autorizado.</strong> <span className="t-muted">Todos nuestros productos vienen con garantía oficial del fabricante y respaldo técnico local.</span>
          </div>
          <button onClick={() => onNav('compare')} className="btn btn-ghost btn-sm">Verificar autenticidad <Icon.ChevronRight size={12}/></button>
        </div>
      </div>
    </section>
  );
};

window.BrandsStrip = BrandsStrip;
