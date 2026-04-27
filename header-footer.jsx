// Header & navigation
const { Logo, formatCLP, Badge } = window.UI;

const TopBar = ({ store, onOpenStore, address, onOpenAddress, onNav }) => (
  <div style={{
    background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
    color: 'var(--text-muted)',
  }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '8px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={onOpenStore} className="topbar-store" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 10px', margin: '-4px 0',
          background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--text)',
          transition: 'all 0.15s',
        }}>
          <Icon.Pin size={11}/>
          <span style={{ color: 'var(--text-dim)' }}>TIENDA</span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{(store && store.name.toUpperCase()) || 'SANTIAGO CENTRO'}</span>
          <Icon.ChevronDown size={10}/>
        </button>

        {address && (
          <button onClick={onOpenAddress} className="topbar-store" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 10px', margin: '-4px 0',
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--text)',
            transition: 'all 0.15s', maxWidth: 320, overflow: 'hidden',
          }} title={`${address.line1} · ${address.commune}, ${address.region}`}>
            <Icon.Truck size={11}/>
            <span style={{ color: 'var(--text-dim)' }}>DESPACHAR A</span>
            <span style={{ color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address.commune.toUpperCase()}</span>
            <Icon.ChevronDown size={10}/>
          </button>
        )}

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="dot" style={{ background: 'var(--success)' }}></span>
          DESPACHO {store?.eta?.toUpperCase() || '24H'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Phone size={12}/> 600 600 1234</span>
        <button onClick={() => onNav && onNav('b2b')} style={{ background: 'none', border: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, letterSpacing: 'inherit' }}>FACTURACIÓN</button>
        <button onClick={() => onNav && onNav('b2b')} style={{ background: 'none', border: 0, color: 'var(--primary)', font: 'inherit', cursor: 'pointer', padding: 0, letterSpacing: 'inherit', fontWeight: 600 }}>EMPRESAS</button>
      </div>
    </div>
  </div>
);

const Header = ({ onNav, cartCount, vehicle, onOpenVehicle, currentRoute, store, onOpenStore, user, address, onOpenAddress }) => {
  const [searchFocus, setSearchFocus] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const accountRef = React.useRef(null);

  React.useEffect(() => {
    const close = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountMenuOpen(false);
    };
    if (accountMenuOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [accountMenuOpen]);
  
  const suggestions = searchVal ? window.MOCK.PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchVal.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <>
      <TopBar store={store} onOpenStore={onOpenStore} address={address} onOpenAddress={onOpenAddress} onNav={onNav}/>
      <header style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Logo size={44}/>
          </button>

          {/* Search — hero of the header */}
          <div style={{ flex: 1, position: 'relative', maxWidth: 720 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--surface-2)',
              border: `1.5px solid ${searchFocus ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 10, padding: '0 16px', height: 48,
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: searchFocus ? '0 0 0 4px rgba(255,91,31,0.12)' : 'none',
            }}>
              <span className="ha-trigger" style={{ display: 'inline-flex', color: 'var(--text-dim)' }}><window.HeaderAnim.Search size={18}/></span>
              <input 
                value={searchVal}
                onChange={e => { setSearchVal(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setSearchFocus(true); setShowSuggestions(true); }}
                onBlur={() => { setSearchFocus(false); setTimeout(() => setShowSuggestions(false), 200); }}
                placeholder="Busca por SKU, código OEM, producto o marca…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 15 }}
              />
              <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--surface-3)', padding: '3px 7px', borderRadius: 5, color: 'var(--text-dim)' }}>⌘ K</kbd>
            </div>
            
            {showSuggestions && searchVal && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 8, boxShadow: 'var(--shadow-3)',
                animation: 'scale-in 0.12s ease', transformOrigin: 'top',
                zIndex: 100,
              }}>
                <div className="t-eyebrow" style={{ padding: '8px 10px 4px' }}>Sugerencias</div>
                {suggestions.length > 0 ? suggestions.map(p => (
                  <button key={p.id} onClick={() => { onNav('pdp', { productId: p.id }); setSearchVal(''); setShowSuggestions(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, width: '100%', textAlign: 'left', borderRadius: 6 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                      <window.UI.ProductImg kind={p.image}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="t-sm" style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div className="t-xs t-mono t-dim">{p.sku} · {p.brand}</div>
                    </div>
                    <div className="t-sm" style={{ fontWeight: 600 }}>{formatCLP(p.price)}</div>
                  </button>
                )) : (
                  <div className="t-sm t-muted" style={{ padding: 16, textAlign: 'center' }}>Sin resultados para "{searchVal}"</div>
                )}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, padding: '8px 10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="t-xs t-dim t-mono">↵ buscar</span>
                  <span className="t-xs t-dim t-mono">esc cerrar</span>
                </div>
              </div>
            )}
          </div>

          {/* Right actions — icon only, 48px hit targets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button onClick={() => onNav('garage')} className="btn btn-ghost ha-trigger header-icon-btn" aria-label="Garage" title="Garage">
              <window.HeaderAnim.Garage size={22}/>
            </button>

            {/* Account — avatar+name when logged-in, icon when guest */}
            {user ? (
              <div ref={accountRef} style={{ position: 'relative' }}>
                <button onClick={() => setAccountMenuOpen(o => !o)} className="user-chip" aria-label="Cuenta">
                  <span className="user-avatar">{user.initials}</span>
                  <span className="user-chip-text">
                    <span className="t-xs" style={{ color: 'var(--text-dim)', display: 'block', lineHeight: 1.1 }}>Hola,</span>
                    <span className="t-sm" style={{ fontWeight: 600, display: 'block', lineHeight: 1.2 }}>{user.name.split(' ')[0]}</span>
                  </span>
                  <Icon.ChevronDown size={12} style={{ color: 'var(--text-dim)' }}/>
                </button>
                {accountMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 280, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: 8, boxShadow: 'var(--shadow-3)',
                    animation: 'scale-in 0.12s ease', transformOrigin: 'top right', zIndex: 100,
                  }}>
                    <div style={{ padding: 12, borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="user-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{user.initials}</span>
                        <div style={{ minWidth: 0 }}>
                          <div className="t-sm" style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                          <div className="t-xs t-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, padding: '6px 10px', background: 'var(--primary-soft)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div className="t-xs t-mono" style={{ color: 'var(--primary)', letterSpacing: '0.04em', fontWeight: 600 }}>{user.role.toUpperCase()}</div>
                          <div className="t-xs t-muted" style={{ marginTop: 1 }}>{user.company}</div>
                        </div>
                        <Icon.Shield size={14} style={{ color: 'var(--primary)' }}/>
                      </div>
                    </div>
                    {[
                      { i: Icon.User, t: 'Mi cuenta', go: 'account' },
                      { i: Icon.Package, t: 'Mis pedidos', go: 'account' },
                      { i: Icon.Truck, t: 'Mi garage', go: 'garage' },
                      { i: Icon.Bolt, t: 'Cotizaciones', go: 'compare' },
                    ].map(it => (
                      <button key={it.t} onClick={() => { setAccountMenuOpen(false); onNav(it.go); }}
                        className="account-menu-item">
                        <it.i size={15}/>
                        <span>{it.t}</span>
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6 }}>
                      <button className="account-menu-item" style={{ color: 'var(--text-muted)' }}>
                        <Icon.Close size={15}/> <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onNav('account')} className="btn btn-ghost ha-trigger header-icon-btn" aria-label="Iniciar sesión" title="Iniciar sesión">
                <window.HeaderAnim.User size={22}/>
              </button>
            )}

            <button id="header-cart-btn" onClick={() => onNav('cart')} className="btn btn-ghost ha-trigger header-icon-btn" aria-label="Carrito" title="Carrito" style={{ position: 'relative' }}>
              <window.HeaderAnim.Cart size={22}/>
              {cartCount > 0 && (
                <span key={cartCount} className="cart-badge-pulse" style={{
                  position: 'absolute', top: 4, right: 4, background: 'var(--primary)', color: '#fff',
                  fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px'
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-header: vehicle selector + categories */}
        <nav style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' }}>
            {/* Vehicle selector — promoted to its own slot */}
            <button onClick={onOpenVehicle} className="vehicle-strip-btn" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              background: vehicle ? 'var(--primary-soft)' : 'transparent',
              borderRight: '1px solid var(--border)',
              color: vehicle ? 'var(--primary)' : 'var(--text)',
              borderRadius: 0,
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}>
              <span className="ha-trigger" style={{ display: 'inline-flex' }}><window.HeaderAnim.Truck size={16}/></span>
              {vehicle ? (
                <>
                  <span className="t-xs t-mono" style={{ letterSpacing: '0.04em', opacity: 0.7 }}>MI VEHÍCULO ·</span>
                  <span className="t-sm" style={{ fontWeight: 600 }}>{vehicle.brand} {vehicle.model} {vehicle.year}</span>
                </>
              ) : (
                <span className="t-sm">Mi vehículo · <span className="t-muted">Año / Marca / Modelo</span></span>
              )}
              <Icon.ChevronDown size={14}/>
            </button>

            <button onClick={() => onNav('category')} className="btn btn-ghost btn-sm" style={{ padding: '12px 14px', borderRadius: 0, gap: 6 }}>
              <span className="ha-trigger" style={{ display: 'inline-flex' }}><window.HeaderAnim.Menu size={14}/></span> Todas las categorías
            </button>
            {window.MOCK.CATEGORIES.slice(0, 6).map(c => (
              <button key={c.id} onClick={() => onNav('category', { cat: c.id })} className="btn btn-ghost btn-sm" 
                style={{ padding: '12px 14px', borderRadius: 0, color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                {c.name}
              </button>
            ))}
            <div style={{ flex: 1 }}></div>
            <button onClick={() => onNav('b2b')} className="btn btn-ghost btn-sm" style={{ padding: '12px 14px', borderRadius: 0, gap: 6, color: 'var(--primary)' }}>
              <Icon.Bolt size={12}/> CUENTA EMPRESA
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

const Footer = () => (
  <footer style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', marginTop: 80 }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '64px 32px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
        <div>
          <Logo size={32}/>
          <p className="t-sm t-muted" style={{ marginTop: 16, lineHeight: 1.6 }}>
            Repuestos e implementos para transporte pesado.<br/>Más de 25 años abasteciendo flotas en Chile.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Badge kind="outline">B2B</Badge>
            <Badge kind="outline">RUT EMPRESA</Badge>
            <Badge kind="outline">FACTURA</Badge>
          </div>
        </div>
        {[
          { title: 'Catálogo', items: ['Lubricantes', 'Frenos', 'Filtros', 'Neumáticos', 'Baterías', 'Ver todo'] },
          { title: 'Empresa', items: ['Nosotros', 'Sucursales', 'Cuentas B2B', 'Trabajos', 'Prensa'] },
          { title: 'Soporte', items: ['Centro de ayuda', 'Devoluciones', 'Garantías', 'Envíos', 'Contacto'] },
          { title: 'Legal', items: ['Términos', 'Privacidad', 'Cookies', 'Compliance'] },
        ].map(col => (
          <div key={col.title}>
            <div className="t-eyebrow" style={{ marginBottom: 16 }}>{col.title}</div>
            {col.items.map(i => (
              <div key={i} className="t-sm" style={{ padding: '6px 0', color: 'var(--text-muted)', cursor: 'pointer' }}>{i}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, borderTop: '1px solid var(--border)' }}>
        <span className="t-xs t-mono t-dim">© 2026 IMPLEMENTOS SPA · RUT 76.123.456-7 · SANTIAGO, CHILE</span>
        <span className="t-xs t-mono t-dim">v 4.2.1 · BUILD 26.04</span>
      </div>
    </div>
  </footer>
);

window.Header = Header;
window.Footer = Footer;
