// Blog & editorial content section
const ARTICLES = [
  {
    id: 'a01',
    category: 'Guía técnica',
    title: 'Cómo elegir el aceite correcto para tu camion según norma Euro V o VI',
    excerpt: 'Las especificaciones ACEA y API cambian según el año y normativa del motor. Te explicamos qué buscar en la etiqueta para no dejar tu garantía en riesgo.',
    author: 'Ing. Roberto Muñoz',
    role: 'Especialista técnico',
    date: '2026-04-18',
    readTime: 7,
    cover: 'oil-tech',
    tags: ['Lubricantes', 'Euro VI'],
    featured: true,
  },
  {
    id: 'a02',
    category: 'Mantención',
    title: 'Intervalos de cambio de filtros para Mercedes-Benz Actros: lo que dice fábrica',
    excerpt: 'Tabla oficial de mantención preventiva con kilometrajes y partes recomendadas.',
    author: 'Daniela Soto',
    role: 'Editora técnica',
    date: '2026-04-12',
    readTime: 5,
    cover: 'mb-truck',
    tags: ['Mercedes-Benz', 'Filtros'],
  },
  {
    id: 'a03',
    category: 'Comparativa',
    title: 'Pastillas cerámicas vs semi-metálicas: cuál rinde más en flota urbana',
    excerpt: 'Probamos Brembo, TRW y Bosch en condiciones reales. Resultados sorprendentes.',
    author: 'Carlos Valdivia',
    role: 'Mecánico jefe',
    date: '2026-04-05',
    readTime: 9,
    cover: 'brake-test',
    tags: ['Frenos', 'Comparativa'],
  },
  {
    id: 'a04',
    category: 'Noticias',
    title: 'Nueva regulación de emisiones 2026: qué cambia para tu flota diésel',
    excerpt: 'El MMA publicó los nuevos límites. Te contamos qué implica para mantención.',
    author: 'Equipo Implementos',
    role: 'Redacción',
    date: '2026-03-28',
    readTime: 4,
    cover: 'regulation',
    tags: ['Regulación', 'Diésel'],
  },
];

// Cover illustrations as inline SVG (placeholders, on-brand)
const ArticleCover = ({ kind, large = false }) => {
  const h = large ? 320 : 180;
  const covers = {
    'oil-tech': (
      <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="oc1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1a1a1a"/>
            <stop offset="1" stopColor="#2a2a2a"/>
          </linearGradient>
        </defs>
        <rect width="400" height="320" fill="url(#oc1)"/>
        {/* Oil drum */}
        <ellipse cx="200" cy="100" rx="80" ry="14" fill="#3a3a3a"/>
        <rect x="120" y="100" width="160" height="180" fill="#FFB800"/>
        <ellipse cx="200" cy="280" rx="80" ry="14" fill="#d49600"/>
        <rect x="120" y="140" width="160" height="6" fill="#d49600"/>
        <rect x="120" y="234" width="160" height="6" fill="#d49600"/>
        <text x="200" y="200" textAnchor="middle" fontFamily="Geist" fontWeight="800" fontSize="22" fill="#1a1a1a">15W-40</text>
        <text x="200" y="220" textAnchor="middle" fontFamily="Geist" fontWeight="600" fontSize="11" fill="#1a1a1a">EURO VI</text>
        {/* Liquid drops */}
        <circle cx="80" cy="180" r="8" fill="#FFB800" opacity="0.4"/>
        <circle cx="340" cy="220" r="6" fill="#FFB800" opacity="0.3"/>
        <circle cx="60" cy="240" r="4" fill="#FFB800" opacity="0.5"/>
      </svg>
    ),
    'mb-truck': (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="200" fill="#0a3a5c"/>
        {/* Truck silhouette */}
        <rect x="50" y="80" width="120" height="70" fill="#fff"/>
        <rect x="170" y="60" width="180" height="90" fill="#fff"/>
        <circle cx="100" cy="160" r="18" fill="#1a1a1a"/>
        <circle cx="220" cy="160" r="18" fill="#1a1a1a"/>
        <circle cx="300" cy="160" r="18" fill="#1a1a1a"/>
        <circle cx="100" cy="160" r="8" fill="#666"/>
        <circle cx="220" cy="160" r="8" fill="#666"/>
        <circle cx="300" cy="160" r="8" fill="#666"/>
        <rect x="60" y="90" width="40" height="30" fill="#7eb8de"/>
        {/* Star badge */}
        <circle cx="80" cy="135" r="10" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
        <line x1="80" y1="125" x2="80" y2="145" stroke="#1a1a1a" strokeWidth="1.5"/>
        <line x1="73" y1="130" x2="87" y2="140" stroke="#1a1a1a" strokeWidth="1.5"/>
        <line x1="87" y1="130" x2="73" y2="140" stroke="#1a1a1a" strokeWidth="1.5"/>
      </svg>
    ),
    'brake-test': (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="200" fill="#1a1a1a"/>
        {/* Brake disc */}
        <circle cx="140" cy="100" r="70" fill="#444"/>
        <circle cx="140" cy="100" r="60" fill="#666"/>
        <circle cx="140" cy="100" r="20" fill="#1a1a1a"/>
        {[0, 60, 120, 180, 240, 300].map(a => (
          <line key={a} x1="140" y1="100" x2={140 + 60 * Math.cos(a * Math.PI / 180)} y2={100 + 60 * Math.sin(a * Math.PI / 180)} stroke="#1a1a1a" strokeWidth="2"/>
        ))}
        {/* Pads */}
        <rect x="240" y="70" width="80" height="20" rx="3" fill="#E2231A"/>
        <rect x="240" y="100" width="80" height="20" rx="3" fill="#888"/>
        <rect x="240" y="130" width="80" height="20" rx="3" fill="#003DA5"/>
        <text x="330" y="84" fontFamily="Geist" fontWeight="700" fontSize="9" fill="#fff">BREMBO</text>
        <text x="330" y="114" fontFamily="Geist" fontWeight="700" fontSize="9" fill="#fff">TRW</text>
        <text x="330" y="144" fontFamily="Geist" fontWeight="700" fontSize="9" fill="#fff">BOSCH</text>
      </svg>
    ),
    'regulation': (
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="200" fill="#006DB6"/>
        {/* Document */}
        <rect x="120" y="40" width="160" height="120" fill="#fff" rx="4"/>
        <rect x="135" y="55" width="80" height="6" fill="#1a1a1a"/>
        <rect x="135" y="70" width="130" height="3" fill="#999"/>
        <rect x="135" y="78" width="120" height="3" fill="#999"/>
        <rect x="135" y="86" width="125" height="3" fill="#999"/>
        <rect x="135" y="100" width="110" height="3" fill="#999"/>
        <rect x="135" y="108" width="115" height="3" fill="#999"/>
        {/* Stamp */}
        <circle cx="240" cy="135" r="18" fill="none" stroke="#E2231A" strokeWidth="2"/>
        <text x="240" y="139" textAnchor="middle" fontFamily="Geist" fontWeight="800" fontSize="9" fill="#E2231A">2026</text>
        {/* Smoke wisps */}
        <path d="M 50 100 Q 60 80 70 100 T 90 100" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4"/>
        <path d="M 320 60 Q 335 40 350 60 T 380 60" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4"/>
      </svg>
    ),
  };
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: 'var(--surface)' }}>
      {covers[kind] || covers['oil-tech']}
    </div>
  );
};

const ArticleDate = ({ date }) => {
  const d = new Date(date);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return <span>{d.getDate()} {months[d.getMonth()]} {d.getFullYear()}</span>;
};

const BlogSection = ({ onNav }) => {
  const featured = ARTICLES.find(a => a.featured);
  const others = ARTICLES.filter(a => !a.featured);

  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="t-eyebrow">CENTRO DE CONOCIMIENTO</div>
          <h2 className="t-h2" style={{ marginTop: 8 }}>Guías, comparativas y noticias del sector.</h2>
          <p className="t-body t-muted" style={{ marginTop: 8, maxWidth: 560, fontSize: 15 }}>
            Contenido técnico escrito por mecánicos e ingenieros de Implementos.
          </p>
        </div>
        <button onClick={() => onNav('blog')} className="btn btn-secondary btn-sm">
          Ver todos los artículos <Icon.ChevronRight size={14}/>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* Featured */}
        <article className="card lift" onClick={() => onNav('article', { id: featured.id })} style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 320, position: 'relative' }}>
            <ArticleCover kind={featured.cover} large/>
            <div style={{ position: 'absolute', top: 16, left: 16, padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {featured.category}
            </div>
          </div>
          <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 12 }}>{featured.title}</h3>
            <p className="t-body t-muted" style={{ marginBottom: 20, fontSize: 15, lineHeight: 1.6 }}>{featured.excerpt}</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
                {featured.author.split(' ').slice(-2).map(s => s[0]).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{featured.author}</div>
                <div className="t-xs t-dim">{featured.role}</div>
              </div>
              <div className="t-xs t-dim" style={{ textAlign: 'right' }}>
                <div><ArticleDate date={featured.date}/></div>
                <div>{featured.readTime} min lectura</div>
              </div>
            </div>
          </div>
        </article>

        {/* Side list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {others.map(a => (
            <article key={a.id} className="card lift" onClick={() => onNav('article', { id: a.id })} style={{ cursor: 'pointer', overflow: 'hidden', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 0 }}>
              <div style={{ position: 'relative' }}>
                <ArticleCover kind={a.cover}/>
              </div>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--primary)' }}>{a.category}</span>
                  <span className="t-xs t-dim">·</span>
                  <span className="t-xs t-dim">{a.readTime} min</span>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 8 }}>{a.title}</h4>
                <p className="t-sm t-muted" style={{ marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.excerpt}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="t-xs t-dim">{a.author}</span>
                  <span className="t-xs t-dim"><ArticleDate date={a.date}/></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter strip */}
      <div style={{ marginTop: 32, padding: '24px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
            <Icon.Mail size={20}/>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Boletín técnico mensual</div>
            <div className="t-sm t-muted">Guías, alertas de mantención y ofertas exclusivas para flotas. Sin spam.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="email" placeholder="tu@empresa.cl" className="input" style={{ minWidth: 240 }}/>
          <button className="btn btn-primary">Suscribirme</button>
        </div>
      </div>
    </section>
  );
};

window.BlogSection = BlogSection;
