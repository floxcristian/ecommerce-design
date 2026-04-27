// Product Card + Vehicle Selector modal + Mini cart
const { ProductImg, formatCLP, computePPU, formatPPU, Rating, Badge } = window.UI;

// Stable pseudo-random based on product id (so popularity numbers don't flicker)
const hashStr = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); };
const popularitySignal = (product) => {
  const h = hashStr(product.id || product.sku || product.name);
  const r = h % 100;
  if (product.badge === 'Más vendido' || r < 18) return { kind: 'sold', n: 30 + (h % 80), label: 'vendidos esta semana' };
  if (r < 38) return { kind: 'viewing', n: 4 + (h % 14), label: 'viendo ahora' };
  if (r < 58) return { kind: 'views', n: 40 + (h % 180), label: 'vistas hoy' };
  return null;
};

const ProductCard = ({ product, onNav, onAdd, density = 'comfortable' }) => {
  const [hover, setHover] = React.useState(false);
  const discount = Math.round((1 - product.price / product.listPrice) * 100);
  const ppu = computePPU(product);
  const pop = popularitySignal(product);

  // Read compare/wishlist sets reactively
  const [compareSet, setCompareSet] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('imp_compare') || '[]')); } catch { return new Set(); }
  });
  const [wishSet, setWishSet] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('imp_wishlist') || '[]')); } catch { return new Set(); }
  });
  React.useEffect(() => {
    const onChange = (e) => setCompareSet(new Set(e.detail));
    window.addEventListener('compare-change', onChange);
    return () => window.removeEventListener('compare-change', onChange);
  }, []);
  const inCompare = compareSet.has(product.id);
  const inWish = wishSet.has(product.id);
  const toggleCompare = (e) => {
    e.stopPropagation();
    const set = new Set(compareSet);
    if (set.has(product.id)) set.delete(product.id);
    else if (set.size < 4) set.add(product.id);
    localStorage.setItem('imp_compare', JSON.stringify([...set]));
    setCompareSet(set);
    window.dispatchEvent(new CustomEvent('compare-change', { detail: [...set] }));
  };
  const toggleWish = (e) => {
    e.stopPropagation();
    const set = new Set(wishSet);
    if (set.has(product.id)) set.delete(product.id);
    else set.add(product.id);
    localStorage.setItem('imp_wishlist', JSON.stringify([...set]));
    setWishSet(set);
  };

  return (
    <div className="card lift spot-card" 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={() => onNav('pdp', { productId: product.id })}>
      <div style={{ aspectRatio: '1', position: 'relative', borderBottom: '1px solid var(--border)' }}>
        <div className="product-img-wrap" style={{ position: 'absolute', inset: 0 }}>
          <ProductImg kind={product.image}/>
        </div>
        {product.badge && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge kind={product.badge === 'OEM' ? 'info' : product.badge === 'Más vendido' ? 'primary' : 'success'}>{product.badge}</Badge>
          </div>
        )}
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <Badge kind="warning">-{discount}%</Badge>
          </div>
        )}
        <button
          className={`card-compare-btn ${inCompare ? 'is-active' : ''}`}
          onClick={toggleCompare}
          aria-label={inCompare ? 'Quitar del comparador' : 'Agregar al comparador'}
          title={inCompare ? 'Quitar del comparador' : 'Comparar'}>
          <Icon.Compare size={14}/>
        </button>
        <button
          onClick={toggleWish}
          aria-label={inWish ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`card-heart-btn ${inWish ? 'is-active' : ''}`}
          style={{
            position: 'absolute', bottom: 10, right: 10,
            width: 32, height: 32, borderRadius: 999, background: 'var(--bg-elevated)',
            border: `1px solid ${inWish ? '#e0245e' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hover || inWish ? 1 : 0, transition: 'opacity 0.15s, color 0.15s, border-color 0.15s',
            color: inWish ? '#e0245e' : 'var(--text)'
          }}>
          <Icon.Heart size={14}/>
        </button>
        {product.fitsVehicle && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', background: 'rgba(0,210,106,0.12)', border: '1px solid var(--success)',
            borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--success)', letterSpacing: '0.04em' }}>
            <Icon.Check size={10}/> COMPATIBLE
          </div>
        )}
      </div>

      <div style={{ padding: density === 'compact' ? 12 : 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="t-xs t-mono t-dim">{product.brand.toUpperCase()}</span>
          <span className="t-xs t-mono t-dim">{product.sku}</span>
        </div>
        <div className="t-sm" style={{ fontWeight: 500, lineHeight: 1.35, minHeight: 38, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>
        <Rating value={product.rating} count={product.reviews}/>
        {pop && (
          <div className={`pop-signal pop-${pop.kind}`}>
            <span className="pop-icon">
              {pop.kind === 'sold' && <Icon.TrendUp size={11}/>}
              {pop.kind === 'viewing' && <Icon.Eye size={11}/>}
              {pop.kind === 'views' && <Icon.Eye size={11}/>}
            </span>
            <span><strong>{pop.n}</strong> {pop.label}</span>
          </div>
        )}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="t-h3" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCLP(product.price)}</span>
            {product.listPrice > product.price && (
              <span className="t-xs t-dim" style={{ textDecoration: 'line-through' }}>{formatCLP(product.listPrice)}</span>
            )}
          </div>
          {ppu && (
            <div className="t-xs t-mono t-dim" style={{ marginTop: 2, letterSpacing: '0.02em' }}>
              {formatPPU(ppu)}
            </div>
          )}
          {window.VolumePricing && <window.VolumePricing.VolumePricingBadge product={product}/>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span className={`t-xs ${product.stock <= 20 ? 'stock-urgent' : ''}`} style={{ color: product.stock > 20 ? 'var(--success)' : 'var(--warning)' }}>
            <span className="dot" style={{ background: 'currentColor', marginRight: 4 }}></span>
            {product.stock > 20 ? `${product.stock} en stock` : `Sólo ${product.stock} disp.`}
          </span>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); window.flyToCart && window.flyToCart(e); onAdd(product); }}>
            <Icon.Plus size={14}/> Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

// Vehicle Selector Modal
const VehicleModal = ({ open, onClose, onSelect, current }) => {
  const [step, setStep] = React.useState(0);
  const [year, setYear] = React.useState(null);
  const [brand, setBrand] = React.useState(null);
  const [model, setModel] = React.useState(null);

  React.useEffect(() => {
    if (open) { setStep(0); setYear(null); setBrand(null); setModel(null); }
  }, [open]);

  if (!open) return null;

  const steps = [
    { key: 'year', label: 'Año', value: year },
    { key: 'brand', label: 'Marca', value: brand },
    { key: 'model', label: 'Modelo', value: model },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fade-in 0.15s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 720, maxHeight: '85vh', overflow: 'hidden',
        animation: 'scale-in 0.2s ease', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>SELECTOR DE VEHÍCULO</div>
            <h2 className="t-h2" style={{ margin: '6px 0 0', fontSize: 24 }}>¿Para qué vehículo buscas?</h2>
            <p className="t-sm t-muted" style={{ margin: '6px 0 0' }}>Filtramos solo repuestos compatibles con tu camión.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon.Close size={16}/></button>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, padding: '14px 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              background: step === i ? 'var(--surface)' : 'transparent', cursor: 'pointer',
              borderBottom: step === i ? '2px solid var(--primary)' : '2px solid transparent',
            }} onClick={() => s.value && setStep(i)}>
              <div className="t-xs t-mono t-dim">PASO 0{i+1}</div>
              <div className="t-sm" style={{ fontWeight: 600, marginTop: 2 }}>
                {s.value || s.label}
                {s.value && <Icon.Check size={12} style={{ marginLeft: 6, color: 'var(--success)' }}/>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
          {step === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {window.MOCK.VEHICLE_YEARS.map(y => (
                <button key={y} onClick={() => { setYear(y); setStep(1); }}
                  className="btn btn-secondary" style={{ padding: '14px 0', justifyContent: 'center' }}>
                  {y}
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {window.MOCK.VEHICLE_BRANDS.map(b => (
                <button key={b} onClick={() => { setBrand(b); setStep(2); }}
                  className="btn btn-secondary" style={{ padding: '16px', justifyContent: 'flex-start', gap: 12 }}>
                  <Icon.Truck size={16}/> {b}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {(window.MOCK.VEHICLE_MODELS[brand] || []).map(m => (
                <button key={m} onClick={() => { onSelect({ year, brand, model: m }); onClose(); }}
                  className="btn btn-secondary" style={{ padding: '16px', justifyContent: 'space-between' }}>
                  <span>{m}</span>
                  <Icon.ChevronRight size={14}/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
            <Icon.ChevronLeft size={14}/> Anterior
          </button>
          <span className="t-xs t-mono t-dim">O ingresa tu PATENTE para autocompletar</span>
        </div>
      </div>
    </div>
  );
};

// Mini cart drawer
const FREE_SHIPPING_THRESHOLD = 250000;
const FreeShippingProgress = ({ subtotal }) => {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0;
  return (
    <div className={`free-ship-bar ${unlocked ? 'is-unlocked' : ''}`}>
      <div className="free-ship-text">
        {unlocked ? (
          <>
            <span className="free-ship-icon"><Icon.Check size={14}/></span>
            <span><strong>¡Despacho gratis desbloqueado!</strong></span>
          </>
        ) : (
          <>
            <span className="free-ship-icon"><Icon.Truck size={14}/></span>
            <span>Te faltan <strong>{formatCLP(remaining)}</strong> para despacho gratis</span>
          </>
        )}
      </div>
      <div className="free-ship-track">
        <div className="free-ship-fill" style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
};

const MiniCart = ({ open, onClose, items, onUpdate, onRemove, onCheckout }) => {
  if (!open) return null;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(subtotal * 0.19);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 100, animation: 'fade-in 0.15s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 440,
        background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        animation: 'slide-in-right 0.2s ease'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="t-eyebrow">CARRITO</div>
            <h2 className="t-h3" style={{ margin: '4px 0 0' }}>{items.length} {items.length === 1 ? 'ítem' : 'ítems'}</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon.Close size={16}/></button>
        </div>

        {items.length > 0 && <FreeShippingProgress subtotal={subtotal}/>}

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {items.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <Icon.Cart size={48}/>
              <p className="t-muted" style={{ marginTop: 16 }}>Tu carrito está vacío</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                <ProductImg kind={item.image}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-xs t-mono t-dim">{item.brand.toUpperCase()} · {item.sku}</div>
                <div className="t-sm" style={{ fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6 }}>
                    <button onClick={() => onUpdate(item.id, item.qty - 1)} style={{ padding: '4px 8px' }}><Icon.Minus size={12}/></button>
                    <span className="t-sm t-mono" style={{ padding: '0 10px', minWidth: 30, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => onUpdate(item.id, item.qty + 1)} style={{ padding: '4px 8px' }}><Icon.Plus size={12}/></button>
                  </div>
                  <div className="t-sm" style={{ fontWeight: 600 }}>{formatCLP(item.price * item.qty)}</div>
                </div>
              </div>
              <button onClick={() => onRemove(item.id)} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}><Icon.Trash size={14}/></button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }} className="t-sm t-muted">
              <span>Subtotal (neto)</span><span>{formatCLP(subtotal - iva)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }} className="t-sm t-muted">
              <span>IVA</span><span>{formatCLP(iva)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span className="t-h3" style={{ fontSize: 22 }}>{formatCLP(subtotal)}</span>
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={onCheckout}>
              Ir al checkout <Icon.ChevronRight size={14}/>
            </button>
            <button className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 8 }} onClick={onClose}>Seguir comprando</button>
          </div>
        )}
      </div>
    </div>
  );
};

window.Catalog = { ProductCard, VehicleModal, MiniCart };

// Store / branch selector — affects stock, pricing and ETAs
const StoreModal = ({ open, onClose, onSelect, current }) => {
  const [query, setQuery] = React.useState('');
  React.useEffect(() => { if (open) setQuery(''); }, [open]);

  if (!open) return null;
  const stores = window.MOCK.STORES.filter(s =>
    !query ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.address.toLowerCase().includes(query.toLowerCase())
  );

  const stockLabel = (h) => h >= 0.9 ? 'Stock alto' : h >= 0.75 ? 'Buen stock' : h >= 0.6 ? 'Stock parcial' : 'Stock limitado';
  const stockColor = (h) => h >= 0.9 ? 'var(--success)' : h >= 0.75 ? 'var(--success)' : h >= 0.6 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fade-in 0.15s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '85vh', overflow: 'hidden',
        animation: 'scale-in 0.2s ease', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>TIENDA / SUCURSAL</div>
            <h2 className="t-h2" style={{ margin: '6px 0 0', fontSize: 24 }}>¿Desde qué sucursal compras?</h2>
            <p className="t-sm t-muted" style={{ margin: '6px 0 0', maxWidth: 520 }}>El stock, precios y tiempos de despacho varían según la sucursal seleccionada.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon.Close size={16}/></button>
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
            <Icon.Search size={16} style={{ color: 'var(--text-dim)' }}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca por ciudad, comuna o dirección…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }}/>
          </div>
        </div>

        <div style={{ padding: 16, overflowY: 'auto', flex: 1, display: 'grid', gap: 8 }}>
          {stores.map(s => {
            const active = current?.id === s.id;
            return (
              <button key={s.id} onClick={() => { onSelect(s); onClose(); }}
                style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 14,
                  padding: '14px 16px', textAlign: 'left',
                  background: active ? 'var(--primary-soft)' : 'var(--surface)',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 10, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? 'var(--primary)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#fff' : 'var(--text-dim)' }}>
                  <Icon.Pin size={14}/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="t-sm" style={{ fontWeight: 600 }}>{s.name}</span>
                    {s.isFlagship && <span className="t-xs t-mono" style={{ color: 'var(--primary)', background: 'var(--primary-soft)', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>FLAGSHIP</span>}
                    {s.isWarehouse && <span className="t-xs t-mono" style={{ color: 'var(--text-muted)', background: 'var(--surface-3)', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>BODEGA</span>}
                  </div>
                  <div className="t-xs t-muted" style={{ marginTop: 2 }}>{s.address} · Región {s.region}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: stockColor(s.stockHealth), boxShadow: `0 0 6px ${stockColor(s.stockHealth)}` }}></span>
                    <span className="t-xs" style={{ fontWeight: 600, color: stockColor(s.stockHealth) }}>{stockLabel(s.stockHealth)}</span>
                  </div>
                  <div className="t-xs t-mono t-dim" style={{ marginTop: 2 }}>{s.eta}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
          <span className="t-xs t-muted">El stock se actualiza cada 5 min. Despachos a regiones disponibles desde cualquier sucursal.</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

window.StoreModal = StoreModal;

// Address selector — destination, affects ETA + shipping cost
const AddressModal = ({ open, onClose, onSelect, current }) => {
  const SAVED = [
    { id: 'casa', label: 'Casa', icon: 'Home', line1: 'Av. Apoquindo 5950, dpto 802', commune: 'Las Condes', region: 'RM' },
    { id: 'oficina', label: 'Oficina · Transportes Andes', icon: 'Briefcase', line1: 'Camino a Melipilla 12450, bodega 4', commune: 'Maipú', region: 'RM' },
    { id: 'taller', label: 'Taller flota', icon: 'Wrench', line1: 'Av. Vicuña Mackenna 9870', commune: 'La Florida', region: 'RM' },
  ];
  const [query, setQuery] = React.useState('');
  React.useEffect(() => { if (open) setQuery(''); }, [open]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fade-in 0.15s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '85vh', overflow: 'hidden',
        animation: 'scale-in 0.2s ease', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>DIRECCIÓN DE DESPACHO</div>
            <h2 className="t-h2" style={{ margin: '6px 0 0', fontSize: 22 }}>¿Dónde despachamos?</h2>
            <p className="t-sm t-muted" style={{ margin: '6px 0 0', maxWidth: 480 }}>Mostraremos disponibilidad, precios de envío y tiempos para esta dirección.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon.Close size={16}/></button>
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
            <Icon.Search size={16} style={{ color: 'var(--text-dim)' }}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar otra dirección, comuna o código postal…"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }}/>
          </div>
        </div>

        <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
          <div className="t-eyebrow" style={{ padding: '4px 8px 10px' }}>Direcciones guardadas</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {SAVED.map(a => {
              const active = current?.id === a.id;
              const Ico = Icon[a.icon] || Icon.Pin;
              return (
                <button key={a.id} onClick={() => { onSelect(a); onClose(); }}
                  style={{
                    display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 14,
                    padding: '14px 16px', textAlign: 'left',
                    background: active ? 'var(--primary-soft)' : 'var(--surface)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 10, transition: 'all 0.15s'
                  }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: active ? 'var(--primary)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#fff' : 'var(--text-dim)' }}>
                    <Ico size={16}/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="t-sm" style={{ fontWeight: 600 }}>{a.label}</div>
                    <div className="t-xs t-muted" style={{ marginTop: 2 }}>{a.line1} · {a.commune}, {a.region}</div>
                  </div>
                  {active && <Icon.Check size={16} style={{ color: 'var(--primary)' }}/>}
                </button>
              );
            })}
          </div>

          <button className="btn btn-secondary btn-block" style={{ marginTop: 14, justifyContent: 'center', gap: 8 }}>
            <Icon.Plus size={14}/> Agregar nueva dirección
          </button>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <span className="t-xs t-muted">Despachamos a todo Chile · Algunas zonas pueden tener restricciones de tamaño/peso</span>
        </div>
      </div>
    </div>
  );
};

window.AddressModal = AddressModal;
