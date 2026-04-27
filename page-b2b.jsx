// B2B EMPRESA — multi-user account, quotations, credit, custom pricing
const { ProductImg, formatCLP, Badge } = window.UI;

const StatCard = ({ label, value, delta, sub, accent }) => (
  <div className="card" style={{ padding: 20 }}>
    <div className="t-xs t-mono t-dim" style={{ marginBottom: 8 }}>{label.toUpperCase()}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || 'var(--text)' }}>{value}</div>
      {delta && <div className="t-xs" style={{ color: delta.startsWith('+') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{delta}</div>}
    </div>
    {sub && <div className="t-xs t-muted" style={{ marginTop: 4 }}>{sub}</div>}
  </div>
);

const B2BPage = ({ onNav, user }) => {
  const [tab, setTab] = React.useState('overview');
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'Grid' },
    { id: 'orders', label: 'Pedidos', icon: 'Box' },
    { id: 'quotes', label: 'Cotizaciones', icon: 'FileText' },
    { id: 'invoices', label: 'Facturas', icon: 'Tag' },
    { id: 'team', label: 'Equipo', icon: 'Users' },
    { id: 'pricing', label: 'Mi precio', icon: 'Star' },
    { id: 'fleet', label: 'Mi flota', icon: 'Car' },
  ];

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 32px' }}>
      {/* Hero account header */}
      <div className="card" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, var(--brand-deep), var(--primary))', color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }}>TA</div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="t-xs t-mono" style={{ opacity: 0.7, marginBottom: 4, letterSpacing: '0.06em' }}>CUENTA EMPRESA · TIER GOLD</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>Transportes Andes Ltda.</h1>
            <div className="t-sm" style={{ opacity: 0.85, marginTop: 4 }}>RUT 76.234.891-K · 47 vehículos · KAM: Diego Rojas</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="t-xs t-mono" style={{ opacity: 0.7 }}>CUPO DISPONIBLE</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>$1.847.500</div>
              <div className="t-xs" style={{ opacity: 0.7 }}>de $2.500.000</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ textAlign: 'right' }}>
              <div className="t-xs t-mono" style={{ opacity: 0.7 }}>DESCUENTO</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>−12%</div>
              <div className="t-xs" style={{ opacity: 0.7 }}>en todo el catálogo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(t => {
          const I = Icon[t.icon] || Icon.Grid;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="btn btn-sm" style={{ borderRadius: 0, borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent', color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: active ? 600 : 500, paddingBottom: 12, marginBottom: -1 }}>
              <I size={14}/> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && <OverviewTab onNav={onNav}/>}
      {tab === 'orders' && <OrdersTab/>}
      {tab === 'quotes' && <QuotesTab/>}
      {tab === 'invoices' && <InvoicesTab/>}
      {tab === 'team' && <TeamTab/>}
      {tab === 'pricing' && <PricingTab/>}
      {tab === 'fleet' && <FleetTab onNav={onNav}/>}
    </div>
  );
};

// ── Overview ───────────────────────────────
const OverviewTab = ({ onNav }) => (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      <StatCard label="Compras este mes" value="$3.487.900" delta="+18%" sub="vs marzo"/>
      <StatCard label="Pedidos abiertos" value="4" sub="2 en tránsito"/>
      <StatCard label="Cotizaciones" value="7" sub="3 esperando aprobación" accent="var(--primary)"/>
      <StatCard label="Próximo pago" value="$847.200" sub="Vence 15 mayo · 19 días" accent="var(--warning)"/>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
      {/* Spend chart */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Gasto últimos 12 meses</h3>
          <select className="input" style={{ width: 'auto', fontSize: 12 }}>
            <option>Por mes</option>
            <option>Por categoría</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, paddingTop: 20 }}>
          {[42, 58, 51, 67, 72, 64, 81, 75, 88, 92, 79, 100].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: `${h}%`, background: i === 11 ? 'var(--primary)' : 'var(--primary-soft)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                {i === 11 && <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>$3.5M</div>}
              </div>
              <div className="t-xs t-dim">{['M','J','J','A','S','O','N','D','E','F','M','A'][i]}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="t-xs t-dim">Total año</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>$28.490.300</div>
          </div>
          <div>
            <div className="t-xs t-dim">Promedio mensual</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>$2.374.192</div>
          </div>
          <div>
            <div className="t-xs t-dim">Ahorro vs lista</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--success)' }}>$3.142.800</div>
          </div>
        </div>
      </div>

      {/* Top categories */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Top categorías</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { c: 'Lubricantes', pct: 38, val: '$1.082.400' },
            { c: 'Filtros', pct: 24, val: '$683.600' },
            { c: 'Frenos', pct: 18, val: '$512.700' },
            { c: 'Neumáticos', pct: 12, val: '$341.800' },
            { c: 'Otros', pct: 8, val: '$227.900' },
          ].map(c => (
            <div key={c.c}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="t-sm">{c.c}</span>
                <span className="t-sm t-mono" style={{ fontWeight: 600 }}>{c.val}</span>
              </div>
              <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--primary)' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick actions */}
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Acciones rápidas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { i: 'Plus', t: 'Nueva cotización', s: 'Pide precios para tu flota', accent: true },
          { i: 'Upload', t: 'Cargar OC en bulk', s: 'Sube CSV con tus pedidos' },
          { i: 'Users', t: 'Invitar comprador', s: 'Agregar usuario al equipo' },
          { i: 'Headset', t: 'Hablar con KAM', s: 'Diego Rojas · WhatsApp' },
        ].map(a => {
          const I = Icon[a.i] || Icon.Plus;
          return (
            <button key={a.t} className="card lift" style={{ padding: 18, textAlign: 'left', cursor: 'pointer', borderColor: a.accent ? 'var(--primary)' : 'var(--border)', background: a.accent ? 'var(--primary-soft)' : 'var(--surface)' }}>
              <I size={20} style={{ color: a.accent ? 'var(--primary)' : 'var(--text)', marginBottom: 10 }}/>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.t}</div>
              <div className="t-xs t-muted" style={{ marginTop: 2 }}>{a.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

// ── Orders ───────────────────────────────
const OrdersTab = () => (
  <div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {['Todas', 'En tránsito (2)', 'Preparando (1)', 'Entregadas', 'Devoluciones'].map((s, i) => (
        <button key={s} className={i === 0 ? 'chip chip-active' : 'chip'}>{s}</button>
      ))}
    </div>
    <div className="card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
            {['N° Pedido', 'Comprador', 'Fecha', 'Items', 'Total', 'Estado', 'ETA', ''].map(h => (
              <th key={h} className="t-xs t-mono t-dim" style={{ padding: '12px 16px', fontWeight: 600, letterSpacing: '0.04em' }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { id: 'IMP-2026-04812', buyer: 'Carlos Mendoza', date: '22 abr', items: 4, total: 387900, status: 'tránsito', eta: '28 abr' },
            { id: 'IMP-2026-04789', buyer: 'María Saavedra', date: '21 abr', items: 12, total: 1289000, status: 'preparando', eta: '25 abr' },
            { id: 'IMP-2026-04567', buyer: 'Carlos Mendoza', date: '12 abr', items: 2, total: 134800, status: 'entregado', eta: '15 abr' },
            { id: 'IMP-2026-04201', buyer: 'Juan Peña', date: '28 mar', items: 7, total: 1287400, status: 'entregado', eta: '01 abr' },
            { id: 'IMP-2026-03987', buyer: 'María Saavedra', date: '15 mar', items: 1, total: 89900, status: 'entregado', eta: '17 mar' },
          ].map((o, i) => {
            const statusMap = { 'tránsito': { c: 'primary', t: 'En tránsito' }, 'preparando': { c: 'warning', t: 'Preparando' }, 'entregado': { c: 'success', t: 'Entregado' } };
            const s = statusMap[o.status];
            return (
              <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 14 }}><span className="t-mono t-sm" style={{ fontWeight: 600 }}>{o.id}</span></td>
                <td style={{ padding: 14 }} className="t-sm">{o.buyer}</td>
                <td style={{ padding: 14 }} className="t-sm t-muted">{o.date}</td>
                <td style={{ padding: 14 }} className="t-sm">{o.items}</td>
                <td style={{ padding: 14 }} className="t-sm" style={{ fontWeight: 600 }}>{formatCLP(o.total)}</td>
                <td style={{ padding: 14 }}><Badge kind={s.c}>{s.t}</Badge></td>
                <td style={{ padding: 14 }} className="t-sm t-muted">{o.eta}</td>
                <td style={{ padding: 14 }}><button className="btn btn-ghost btn-sm">Ver</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Quotes ───────────────────────────────
const QuotesTab = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 className="t-h3" style={{ fontSize: 20 }}>Cotizaciones</h2>
      <button className="btn btn-primary"><Icon.Plus size={14}/> Nueva cotización</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {[
        { id: 'COT-2026-0234', name: 'Mantención flota Volvo Q2', items: 24, total: 4287900, status: 'pending', date: '23 abr', expires: '7 días', validity: 'Pendiente aprobación' },
        { id: 'COT-2026-0231', name: 'Renovación neumáticos 18 unidades', items: 18, total: 8802000, status: 'approved', date: '20 abr', expires: '14 días', validity: 'Aprobada · Lista para pagar' },
        { id: 'COT-2026-0228', name: 'Filtros y aceites stock', items: 12, total: 1289000, status: 'approved', date: '18 abr', expires: '10 días', validity: 'Aprobada · Lista para pagar' },
        { id: 'COT-2026-0224', name: 'Pastillas Brembo flota MB', items: 8, total: 719200, status: 'pending', date: '15 abr', expires: '3 días', validity: 'Pendiente aprobación' },
      ].map(q => (
        <div key={q.id} className="card lift" style={{ padding: 20, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div className="t-xs t-mono t-dim">{q.id}</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginTop: 2 }}>{q.name}</div>
            </div>
            <Badge kind={q.status === 'approved' ? 'success' : 'warning'}>{q.status === 'approved' ? 'Aprobada' : 'Pendiente'}</Badge>
          </div>
          <div className="t-sm t-muted" style={{ marginBottom: 12 }}>{q.items} ítems · Solicitada {q.date} · Vence en {q.expires}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div className="t-h3" style={{ fontSize: 22 }}>{formatCLP(q.total)}</div>
            <button className={q.status === 'approved' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}>
              {q.status === 'approved' ? 'Convertir a pedido' : 'Ver detalle'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Invoices ───────────────────────────────
const InvoicesTab = () => (
  <div>
    <div className="card" style={{ padding: 20, marginBottom: 16, background: 'var(--warning-soft, rgba(255,180,0,0.08))', borderColor: 'var(--warning, #f59e0b)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Bell size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Próximo pago: <strong>$847.200</strong> vence el 15 de mayo</div>
          <div className="t-sm t-muted">Factura F-2026-04812 · Crédito 30 días</div>
        </div>
        <button className="btn btn-primary">Pagar ahora</button>
      </div>
    </div>

    <div className="card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
            {['Folio', 'Pedido', 'Emisión', 'Vencimiento', 'Monto', 'Estado', 'PDF'].map(h => (
              <th key={h} className="t-xs t-mono t-dim" style={{ padding: '12px 16px', fontWeight: 600 }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { f: 'F-2026-04812', p: 'IMP-2026-04812', em: '22 abr', vence: '15 may', monto: 847200, status: 'pending' },
            { f: 'F-2026-04567', p: 'IMP-2026-04567', em: '12 abr', vence: '12 may', monto: 134800, status: 'pending' },
            { f: 'F-2026-04201', p: 'IMP-2026-04201', em: '28 mar', vence: '28 abr', monto: 1287400, status: 'paid' },
            { f: 'F-2026-03987', p: 'IMP-2026-03987', em: '15 mar', vence: '15 abr', monto: 89900, status: 'paid' },
            { f: 'F-2026-03654', p: 'IMP-2026-03654', em: '02 mar', vence: '02 abr', monto: 542100, status: 'paid' },
          ].map(i => (
            <tr key={i.f} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: 14 }}><span className="t-mono t-sm" style={{ fontWeight: 600 }}>{i.f}</span></td>
              <td style={{ padding: 14 }} className="t-mono t-xs t-muted">{i.p}</td>
              <td style={{ padding: 14 }} className="t-sm">{i.em}</td>
              <td style={{ padding: 14 }} className="t-sm" style={{ color: i.status === 'pending' ? 'var(--warning, #f59e0b)' : 'inherit' }}>{i.vence}</td>
              <td style={{ padding: 14, fontWeight: 600 }} className="t-sm">{formatCLP(i.monto)}</td>
              <td style={{ padding: 14 }}><Badge kind={i.status === 'paid' ? 'success' : 'warning'}>{i.status === 'paid' ? 'Pagada' : 'Pendiente'}</Badge></td>
              <td style={{ padding: 14 }}><button className="btn btn-ghost btn-sm"><Icon.Download size={12}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Team ───────────────────────────────
const TeamTab = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h2 className="t-h3" style={{ fontSize: 20 }}>Equipo de compras</h2>
        <p className="t-sm t-muted">Gestiona quién puede comprar, aprobar y ver facturas en tu cuenta empresa</p>
      </div>
      <button className="btn btn-primary"><Icon.Plus size={14}/> Invitar miembro</button>
    </div>

    <div className="card">
      {[
        { n: 'Juan Peña', e: 'juan@transportesandes.cl', r: 'Admin', avatar: 'JP', active: true, last: 'Hace 5 min', limit: 'Sin límite' },
        { n: 'Carlos Mendoza', e: 'carlos@transportesandes.cl', r: 'Comprador', avatar: 'CM', active: true, last: 'Hace 2h', limit: '$500.000 / pedido' },
        { n: 'María Saavedra', e: 'maria@transportesandes.cl', r: 'Comprador', avatar: 'MS', active: true, last: 'Ayer', limit: '$1.000.000 / pedido' },
        { n: 'Pedro Lazo', e: 'pedro@transportesandes.cl', r: 'Aprobador', avatar: 'PL', active: true, last: 'Hace 3 días', limit: 'Aprueba >$500K' },
        { n: 'Ana Vidal', e: 'ana@transportesandes.cl', r: 'Solo lectura', avatar: 'AV', active: false, last: 'Hace 2 semanas', limit: '—' },
      ].map((m, i) => (
        <div key={m.e} style={{ padding: 16, display: 'grid', gridTemplateColumns: '40px 1fr auto auto auto', gap: 16, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, position: 'relative' }}>
            {m.avatar}
            {m.active && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg)' }}/>}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{m.n}</div>
            <div className="t-xs t-muted">{m.e} · {m.last}</div>
          </div>
          <Badge kind={m.r === 'Admin' ? 'primary' : m.r === 'Aprobador' ? 'warning' : 'default'}>{m.r}</Badge>
          <div className="t-xs t-muted">{m.limit}</div>
          <button className="btn btn-ghost btn-sm">Editar</button>
        </div>
      ))}
    </div>
  </div>
);

// ── Pricing ───────────────────────────────
const PricingTab = () => (
  <div>
    <div className="card" style={{ padding: 24, marginBottom: 16, background: 'linear-gradient(135deg, var(--primary-soft), transparent)', border: '1px solid var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Award size={24}/>
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="t-h3" style={{ fontSize: 20, marginBottom: 4 }}>Tier Gold · Descuento −12%</h2>
          <p className="t-sm t-muted">Tu cuenta tiene precios negociados sobre todo el catálogo. Lista válida hasta 31-dic-2026.</p>
        </div>
        <button className="btn btn-secondary"><Icon.Download size={14}/> Lista de precios PDF</button>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
      <StatCard label="Descuento base" value="−12%" sub="En todo el catálogo"/>
      <StatCard label="Volumen extra" value="−5%" sub="Sobre $5M / mes"/>
      <StatCard label="Categorías premium" value="−18%" sub="Lubricantes Castrol" accent="var(--success)"/>
    </div>

    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Tabla de precios negociada</h3>
    <div className="card">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {['Producto', 'SKU', 'P. Lista', 'Tu precio', 'Descuento', 'Stock'].map(h => (
              <th key={h} className="t-xs t-mono t-dim" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {window.MOCK.PRODUCTS.slice(0, 6).map((p, i) => {
            const yourPrice = Math.round(p.price * 0.88);
            return (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}><ProductImg kind={p.image}/></div>
                  <div className="t-sm" style={{ fontWeight: 500 }}>{p.name}</div>
                </td>
                <td style={{ padding: 12 }} className="t-mono t-xs t-muted">{p.sku}</td>
                <td style={{ padding: 12 }} className="t-sm t-muted" style={{ textDecoration: 'line-through' }}>{formatCLP(p.price)}</td>
                <td style={{ padding: 12, fontWeight: 700, color: 'var(--success)' }} className="t-sm">{formatCLP(yourPrice)}</td>
                <td style={{ padding: 12 }}><Badge kind="success">−12%</Badge></td>
                <td style={{ padding: 12 }} className="t-sm t-muted">{p.stock} u.</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Fleet ───────────────────────────────
const FleetTab = ({ onNav }) => {
  const fleet = [
    { plate: 'KZBF-22', brand: 'Mercedes-Benz', model: 'Actros 1844', year: 2021, km: 287400, status: 'activo', nextMaint: '12.500 km', driver: 'Carlos Mendoza' },
    { plate: 'JCDR-91', brand: 'Volvo', model: 'FH 460', year: 2019, km: 612000, status: 'mantención', nextMaint: 'Hoy', driver: 'Pedro Lazo' },
    { plate: 'PVHS-04', brand: 'Scania', model: 'R 500', year: 2023, km: 89000, status: 'activo', nextMaint: '23.000 km', driver: 'María Saavedra' },
    { plate: 'GTKM-18', brand: 'MAN', model: 'TGX 28.480', year: 2020, km: 456800, status: 'activo', nextMaint: '8.200 km', driver: 'Juan Peña' },
    { plate: 'XBHF-77', brand: 'Iveco', model: 'Stralis 460', year: 2018, km: 798200, status: 'taller', nextMaint: 'En reparación', driver: '—' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 className="t-h3" style={{ fontSize: 20 }}>Mi flota</h2>
          <p className="t-sm t-muted">{fleet.length} vehículos activos · 47 totales en tu cuenta</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><Icon.Upload size={14}/> Cargar CSV</button>
          <button className="btn btn-primary"><Icon.Plus size={14}/> Agregar vehículo</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard label="Activos" value="42" delta="89%" accent="var(--success)"/>
        <StatCard label="En taller" value="3" sub="6.4% flota"/>
        <StatCard label="Próxima mantención" value="8" sub="En los próximos 30 días" accent="var(--warning, #f59e0b)"/>
      </div>

      <div className="card">
        {fleet.map((v, i) => {
          const sm = { activo: { c: 'success', t: 'Activo' }, mantención: { c: 'warning', t: 'Mantención hoy' }, taller: { c: 'danger', t: 'En taller' } };
          const s = sm[v.status];
          return (
            <div key={v.plate} style={{ padding: 16, display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto', gap: 20, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 64, height: 48, borderRadius: 6, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                <Icon.Truck size={20}/>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="t-mono" style={{ fontWeight: 700, fontSize: 13, padding: '2px 8px', background: '#facc15', color: '#000', borderRadius: 4 }}>{v.plate}</span>
                  <Badge kind={s.c}>{s.t}</Badge>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v.brand} {v.model} · {v.year}</div>
                <div className="t-xs t-muted">{v.km.toLocaleString('es-CL')} km · Conductor: {v.driver}</div>
              </div>
              <div className="t-xs">
                <div className="t-dim">Próx. mantención</div>
                <div style={{ fontWeight: 600, color: v.nextMaint === 'Hoy' ? 'var(--warning, #f59e0b)' : 'var(--text)' }}>{v.nextMaint}</div>
              </div>
              <button onClick={() => onNav('category')} className="btn btn-secondary btn-sm">
                <Icon.Search size={12}/> Buscar repuestos
              </button>
              <button className="btn btn-ghost btn-sm">Editar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

window.B2BPage = B2BPage;
