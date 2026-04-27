// Hero Carousel — auto-rotating, full-width, with dots, arrows, pause-on-hover
const HeroCarousel = ({ onNav, onOpenVehicle, vehicle }) => {
  const slides = [
    {
      id: 'flotas',
      eyebrow: '+58.000 SKUS · ENVÍO 24H',
      title: <>Repuestos para<br/><span style={{ color: 'var(--primary)' }}>flotas que no paran.</span></>,
      body: 'Marcas OEM, despacho garantizado y soporte técnico dedicado para transportistas, talleres y operaciones de flota.',
      cta: { label: 'Buscar por vehículo', icon: 'Truck', action: 'vehicle' },
      ctaSecondary: { label: 'Ver catálogo', action: 'catalog' },
      bg: 'gradient-blue',
      visual: 'truck',
      stats: [
        { n: '58K+', l: 'SKUs en stock' },
        { n: '24h', l: 'Despacho urgente' },
        { n: '12', l: 'Sucursales' },
        { n: '4.9', l: 'Rating B2B' },
      ],
    },
    {
      id: 'black-friday',
      eyebrow: 'OFERTA LIMITADA · TERMINA EN 3 DÍAS',
      title: <>Black Friday B2B<br/><span style={{ color: 'var(--accent)' }}>hasta 35% OFF</span></>,
      body: 'Descuentos exclusivos en lubricantes Mobil, frenos Bosch, filtros Mann y baterías Bosch. Sin tope para cuentas empresa.',
      cta: { label: 'Ver ofertas', icon: 'Bolt', action: 'compare' },
      ctaSecondary: { label: 'Catálogo Black', action: 'catalog' },
      bg: 'gradient-deep',
      visual: 'sale',
      stats: [
        { n: '35%', l: 'Descuento máx' },
        { n: '120+', l: 'SKUs en oferta' },
        { n: '3 días', l: 'Tiempo restante' },
      ],
    },
    {
      id: 'bosch',
      eyebrow: 'PARTNER OFICIAL · NUEVA LÍNEA',
      title: <>Bosch.<br/><span style={{ color: 'var(--primary)' }}>Ingeniería alemana sin compromisos.</span></>,
      body: 'Nuevo catálogo Bosch 2026 disponible: frenos, baterías, sistemas de inyección y herramientas eléctricas con garantía oficial.',
      cta: { label: 'Explorar Bosch', icon: 'ChevronRight', action: 'category' },
      ctaSecondary: { label: 'Documentación técnica', action: 'compare' },
      bg: 'gradient-bosch',
      visual: 'brand',
    },
    {
      id: 'mecanicos',
      eyebrow: 'PROGRAMA MECÁNICOS · CRÉDITO B2B',
      title: <>Tu taller, <span style={{ color: 'var(--primary)' }}>nuestra prioridad.</span></>,
      body: 'Únete al Programa Mecánicos Implementos: precios netos, crédito 30 días, despacho prioritario y catálogo técnico exclusivo.',
      cta: { label: 'Inscribirme', icon: 'User', action: 'account' },
      ctaSecondary: { label: 'Conocer beneficios', action: 'compare' },
      bg: 'gradient-green',
      visual: 'tools',
      stats: [
        { n: '30 días', l: 'Crédito B2B' },
        { n: '−15%', l: 'Precio mecánico' },
        { n: '24/7', l: 'Soporte técnico' },
      ],
    },
  ];

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const ROTATE_MS = 7000;

  React.useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / ROTATE_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setIndex(i => (i + 1) % slides.length);
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [index, paused, slides.length]);

  const goTo = (i) => { setIndex(((i % slides.length) + slides.length) % slides.length); setProgress(0); };
  const handleCTA = (action) => {
    if (action === 'vehicle') return onOpenVehicle();
    if (action === 'catalog') return onNav('category');
    if (action === 'compare') return onNav('compare');
    if (action === 'category') return onNav('category');
    if (action === 'account') return onNav('account');
  };

  const slide = slides[index];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}
    >
      {/* Background layers — one per slide, cross-fade */}
      <div className="hero-kenburns" style={{ position: 'absolute', inset: 0 }}>
        {slides.map((s, i) => (
          <div key={s.id} className={`hero-bg hero-bg-${s.bg}`} style={{
            position: 'absolute', inset: 0, opacity: i === index ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}/>
        ))}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}></div>
      </div>

      <div className="hero-grid" style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 32px 88px', position: 'relative', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center', minHeight: 540 }}>
        {/* Slide content with key for re-mount animation */}
        <div key={slide.id} className="hero-slide-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: 999, marginBottom: 24 }}>
            <span className="dot" style={{ background: 'var(--primary)' }}></span>
            <span className="t-xs t-mono" style={{ color: 'var(--primary)', letterSpacing: '0.08em' }}>{slide.eyebrow}</span>
          </div>
          <h1 className="t-display" style={{ marginBottom: 16 }}>{slide.title}</h1>
          <p className="t-body t-muted" style={{ marginBottom: 32, maxWidth: 520, fontSize: 17, lineHeight: 1.55 }}>{slide.body}</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: slide.stats ? 32 : 0, flexWrap: 'wrap' }}>
            <button onClick={() => handleCTA(slide.cta.action)} className="btn btn-primary btn-lg">
              {slide.cta.icon && Icon[slide.cta.icon] && React.createElement(Icon[slide.cta.icon], { size: 16 })}
              {slide.cta.label}
            </button>
            {slide.ctaSecondary && (
              <button onClick={() => handleCTA(slide.ctaSecondary.action)} className="btn btn-secondary btn-lg">
                {slide.ctaSecondary.label} <Icon.ChevronRight size={14}/>
              </button>
            )}
          </div>
          {slide.stats && (
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {slide.stats.map(s => (
                <div key={s.l}>
                  <div className="t-h2" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>{s.n}</div>
                  <div className="t-xs t-dim t-mono" style={{ letterSpacing: '0.08em' }}>{s.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: vehicle picker (always visible — it's the conversion driver) */}
        <div className="card hero-vehicle-card" style={{ padding: 24, background: 'var(--bg-elevated)', backdropFilter: 'blur(8px)', borderColor: 'var(--border-strong)', boxShadow: 'var(--shadow-2)' }}>
          <div className="t-eyebrow" style={{ color: 'var(--primary)', marginBottom: 12 }}>BÚSQUEDA EXACTA</div>
          <h3 className="t-h3" style={{ marginBottom: 4 }}>Tu camión, tus repuestos.</h3>
          <p className="t-sm t-muted" style={{ marginBottom: 20 }}>Filtramos más de 58.000 productos por compatibilidad exacta.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Año', value: vehicle?.year || 'Selecciona' },
              { label: 'Marca', value: vehicle?.brand || 'Selecciona' },
              { label: 'Modelo', value: vehicle?.model || 'Selecciona' },
            ].map((f, i) => (
              <button key={i} onClick={onOpenVehicle} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 8, textAlign: 'left'
              }}>
                <div>
                  <div className="t-xs t-mono t-dim" style={{ letterSpacing: '0.08em' }}>{f.label.toUpperCase()}</div>
                  <div className="t-sm" style={{ fontWeight: 500, marginTop: 2, color: vehicle ? 'var(--text)' : 'var(--text-dim)' }}>{f.value}</div>
                </div>
                <Icon.ChevronDown size={14}/>
              </button>
            ))}
          </div>
          <button onClick={onOpenVehicle} className="btn btn-primary btn-block btn-lg">
            {vehicle ? 'Cambiar vehículo' : 'Empezar selección'}
          </button>
          <button onClick={() => onNav('garage')} className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 8 }}>
            Ver vehículos guardados (3)
          </button>
        </div>
      </div>

      {/* Controls */}
      <button onClick={() => goTo(index - 1)} className="hero-arrow hero-arrow-left" aria-label="Anterior"><Icon.ChevronLeft size={18}/></button>
      <button onClick={() => goTo(index + 1)} className="hero-arrow hero-arrow-right" aria-label="Siguiente"><Icon.ChevronRight size={18}/></button>

      {/* Pagination */}
      <div className="hero-pagination">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} className={`hero-dot ${i === index ? 'active' : ''}`} aria-label={`Slide ${i + 1}`}>
            <span className="hero-dot-fill" style={{
              width: i === index ? `${progress * 100}%` : (i < index ? '100%' : '0%')
            }}/>
          </button>
        ))}
      </div>
    </section>
  );
};

window.HeroCarousel = HeroCarousel;
