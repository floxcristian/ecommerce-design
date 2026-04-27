// ACCOUNT, GARAGE, COMPARE pages
const { ProductImg, formatCLP, Badge, Rating } = window.UI;

// ACCOUNT
const AccountPage = ({ onNav }) => {
  const [tab, setTab] = React.useState('orders');
  
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: '#fff' }}>CM</div>
        <div>
          <h1 className="t-h2">Hola, Carlos</h1>
          <p className="t-muted">Flota Mendoza SpA · Cuenta B2B · Cupo $2.500.000</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
        <aside>
          {[
            { k: 'orders', l: 'Mis pedidos', i: Icon.Package, c: 4 },
            { k: 'garage', l: 'Mi garage', i: Icon.Garage, c: 3 },
            { k: 'addresses', l: 'Direcciones', i: Icon.Pin, c: 2 },
            { k: 'invoices', l: 'Facturas', i: Icon.Tag },
            { k: 'team', l: 'Equipo y permisos', i: Icon.User, c: 5, badge: 'B2B' },
            { k: 'settings', l: 'Configuración', i: Icon.Settings },
          ].map(t => (
            <button key={t.k} onClick={() => t.k === 'garage' ? onNav('garage') : setTab(t.k)} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', width: '100%', textAlign: 'left', borderRadius: 8, background: tab === t.k ? 'var(--surface)' : 'transparent', color: tab === t.k ? 'var(--text)' : 'var(--text-muted)', borderLeft: tab === t.k ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: 2 }}>
              <t.i size={16}/>
              <span className="t-sm" style={{ fontWeight: tab === t.k ? 600 : 400, flex: 1 }}>{t.l}</span>
              {t.c && <span className="t-xs t-mono t-dim">{t.c}</span>}
              {t.badge && <Badge kind="primary">{t.badge}</Badge>}
            </button>
          ))}
          <div style={{ marginTop: 24, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>CUPO B2B</div>
            <div className="t-h3" style={{ fontSize: 22, marginTop: 6 }}>$1.847.500</div>
            <div className="t-xs t-dim">disponible de $2.500.000</div>
            <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: '74%', height: '100%', background: 'var(--primary)' }}></div>
            </div>
          </div>
        </aside>

        <div>
          {tab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="t-h3">Pedidos recientes</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="input" style={{ width: 'auto', fontSize: 12 }}><option>Últimos 6 meses</option></select>
                  <button className="btn btn-secondary btn-sm">Exportar</button>
                </div>
              </div>
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.6fr', padding: '12px 20px', borderBottom: '1px solid var(--border)' }} className="t-xs t-mono t-dim">
                  <span>PEDIDO</span><span>FECHA</span><span>ESTADO</span><span>ÍTEMS</span><span>TOTAL</span><span></span>
                </div>
                {window.MOCK.ORDERS.map((o, i) => (
                  <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.6fr', padding: '16px 20px', alignItems: 'center', borderBottom: i < window.MOCK.ORDERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="t-sm t-mono" style={{ fontWeight: 600 }}>{o.id}</div>
                    <div className="t-sm">{o.date}</div>
                    <div><Badge kind={o.status === 'Entregado' ? 'success' : 'info'}>{o.status}</Badge></div>
                    <div className="t-sm">{o.items} prod.</div>
                    <div className="t-sm" style={{ fontWeight: 600 }}>{formatCLP(o.total)}</div>
                    <button className="btn btn-ghost btn-sm">Ver</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab !== 'orders' && (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <p className="t-muted">Sección {tab}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// GARAGE
const GaragePage = ({ onNav, onSetVehicle, vehicle }) => {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>MI GARAGE</div>
          <h1 className="t-h1" style={{ fontSize: 36, marginTop: 8 }}>Mis vehículos</h1>
          <p className="t-muted" style={{ marginTop: 4 }}>Gestiona tu flota y consulta el historial de mantenciones.</p>
        </div>
        <button className="btn btn-primary"><Icon.Plus size={14}/> Agregar vehículo</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {window.MOCK.SAVED_VEHICLES.map(v => {
          const active = vehicle?.id === v.id || (vehicle?.brand === v.brand && vehicle?.model === v.model);
          return (
            <div key={v.id} className="card" style={{ padding: 24, position: 'relative', borderColor: active ? 'var(--primary)' : 'var(--border)' }}>
              {active && <div style={{ position: 'absolute', top: 16, right: 16 }}><Badge kind="primary">ACTIVO</Badge></div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Icon.Truck size={24}/>
                </div>
                <div>
                  <div className="t-eyebrow">{v.alias}</div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{v.brand}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div><div className="t-xs t-dim t-mono">MODELO</div><div className="t-sm" style={{ fontWeight: 500 }}>{v.model}</div></div>
                <div><div className="t-xs t-dim t-mono">AÑO</div><div className="t-sm" style={{ fontWeight: 500 }}>{v.year}</div></div>
                <div><div className="t-xs t-dim t-mono">PATENTE</div><div className="t-sm t-mono" style={{ fontWeight: 600 }}>{v.plate}</div></div>
                <div><div className="t-xs t-dim t-mono">KM</div><div className="t-sm" style={{ fontWeight: 500 }}>{v.km.toLocaleString('es-CL')}</div></div>
              </div>
              <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div><div className="t-xs t-dim">Próx. mantención</div><div className="t-sm" style={{ fontWeight: 600 }}>en 3.200 km</div></div>
                <div style={{ textAlign: 'right' }}><div className="t-xs t-dim">Pedidos asociados</div><div className="t-sm" style={{ fontWeight: 600 }}>{Math.floor(Math.random()*15)+3}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { onSetVehicle({ ...v }); onNav('category'); }} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Ver repuestos</button>
                <button className="btn btn-secondary btn-sm"><Icon.Settings size={14}/></button>
              </div>
            </div>
          );
        })}
        <button className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px dashed var(--border-strong)', minHeight: 280, cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, background: 'var(--surface-2)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Plus size={20}/>
          </div>
          <div style={{ fontWeight: 500 }}>Agregar vehículo</div>
          <div className="t-sm t-muted">Patente o año/marca/modelo</div>
        </button>
      </div>
    </div>
  );
};

// COMPARE
const ComparePage = ({ onNav, onAdd }) => {
  const products = window.MOCK.PRODUCTS.slice(0, 3);
  const specs = [
    ['Marca', p => p.brand],
    ['SKU', p => p.sku],
    ['Precio', p => formatCLP(p.price)],
    ['Stock', p => `${p.stock} unidades`],
    ['Evaluación', p => `${p.rating} ★ (${p.reviews})`],
    ['Compatible con tu vehículo', p => p.fitsVehicle ? '✓ Sí' : '— No confirmado'],
    ['Garantía', () => '24 meses'],
    ['Origen', () => 'Alemania'],
    ['Despacho 24h', () => '✓ Sí'],
  ];
  
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      <div className="t-eyebrow">COMPARADOR</div>
      <h1 className="t-h1" style={{ fontSize: 36, marginTop: 8, marginBottom: 24 }}>Compara productos</h1>
      
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${products.length}, 1fr) 1fr` }}>
          <div></div>
          {products.map(p => (
            <div key={p.id} style={{ padding: 20, borderLeft: '1px solid var(--border)' }}>
              <div style={{ aspectRatio: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 12 }}>
                <ProductImg kind={p.image}/>
              </div>
              <div className="t-xs t-mono t-dim">{p.brand.toUpperCase()}</div>
              <div className="t-sm" style={{ fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{p.name}</div>
              <button onClick={() => onAdd(p)} className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12 }}>
                <Icon.Plus size={12}/> Agregar
              </button>
            </div>
          ))}
          <div style={{ padding: 20, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Plus size={16}/>
            </div>
            <div className="t-sm t-muted">Agregar producto</div>
          </div>
        </div>
        
        {specs.map(([label, fn], i) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${products.length}, 1fr) 1fr`, borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
            <div style={{ padding: '14px 20px', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
            {products.map(p => (
              <div key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid var(--border)', fontSize: 13, fontWeight: 500 }}>
                {fn(p)}
              </div>
            ))}
            <div style={{ borderLeft: '1px solid var(--border)' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.AccountPage = AccountPage;
window.GaragePage = GaragePage;
window.ComparePage = ComparePage;
