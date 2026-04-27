// CART, CHECKOUT pages — enhanced with upsells, CL payment methods, trust signals
const { ProductImg, formatCLP, Badge, Rating } = window.UI;

// ───────────────────────────────────────────────────────────
// CART
// ───────────────────────────────────────────────────────────

const FreeShipBar = ({ subtotal }) => {
  const threshold = 100000;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const reached = remaining <= 0;
  return (
    <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: reached ? 'var(--success)' : 'var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Icon.Truck size={16} style={{ color: reached ? 'var(--success)' : 'var(--primary)' }}/>
        {reached ? (
          <span className="t-sm" style={{ fontWeight: 600 }}>¡Envío gratis desbloqueado! 🎉</span>
        ) : (
          <span className="t-sm">Te faltan <strong style={{ color: 'var(--primary)' }}>{formatCLP(remaining)}</strong> para envío gratis</span>
        )}
      </div>
      <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: reached ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--primary-soft))', transition: 'width 0.4s' }}/>
      </div>
    </div>
  );
};

const RecommendedRow = ({ items, currentIds, onAdd }) => {
  const recs = window.MOCK.PRODUCTS.filter(p => !currentIds.includes(p.id)).slice(0, 4);
  return (
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.02em' }}>COMPLETA TU PEDIDO</h3>
        <span className="t-xs t-dim">Compradores también llevan</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {recs.map(p => (
          <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
              <ProductImg kind={p.image}/>
            </div>
            <div className="t-xs t-mono t-dim" style={{ marginBottom: 2 }}>{p.brand.toUpperCase()}</div>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, marginBottom: 6, minHeight: 32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
            <div style={{ marginTop: 'auto' }}>
              <div className="t-h3" style={{ fontSize: 14, marginBottom: 6 }}>{formatCLP(p.price)}</div>
              <button onClick={(e) => { window.flyToCart && window.flyToCart(e); onAdd(p); }} className="btn btn-secondary btn-sm btn-block">
                <Icon.Plus size={11}/> Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartPage = ({ onNav, items, onUpdate, onRemove, onAdd }) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const listTotal = items.reduce((s, i) => s + (i.listPrice || i.price) * i.qty, 0);
  const savings = Math.max(0, listTotal - subtotal);
  const iva = Math.round(subtotal * 0.19);
  const shipping = subtotal === 0 ? 0 : (subtotal > 100000 ? 0 : 8990);
  const total = subtotal + shipping;
  const currentIds = items.map(i => i.id);

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: 32, textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, margin: '0 auto 24px', borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Cart size={48}/>
        </div>
        <h1 className="t-h2" style={{ fontSize: 32, marginBottom: 8 }}>Tu carrito está vacío</h1>
        <p className="t-muted" style={{ marginBottom: 24 }}>Empieza buscando repuestos para tu camión, flota o vehículo.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => onNav('home')} className="btn btn-primary btn-lg">Ver catálogo</button>
          <button onClick={() => onNav('garage')} className="btn btn-secondary btn-lg">Mi garage</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="t-h1" style={{ fontSize: 36 }}>Carrito <span className="t-mono t-dim" style={{ fontSize: 18, fontWeight: 400 }}>· {items.length} {items.length === 1 ? 'producto' : 'productos'}</span></h1>
        <button onClick={() => onNav('home')} className="btn btn-ghost btn-sm">
          <Icon.ChevronLeft size={14}/> Seguir comprando
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
        <div>
          <FreeShipBar subtotal={subtotal}/>

          <div className="card">
            {items.map((item, i) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 20, padding: 20, borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div onClick={() => onNav('pdp', { productId: item.id })} style={{ width: 110, height: 110, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <ProductImg kind={item.image}/>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span className="t-xs t-mono t-dim">{item.brand.toUpperCase()} · {item.sku}</span>
                    {item.fitsVehicle && <Badge kind="success">Compatible</Badge>}
                  </div>
                  <button onClick={() => onNav('pdp', { productId: item.id })} style={{ fontWeight: 600, fontSize: 15, textAlign: 'left', lineHeight: 1.35, marginBottom: 6 }}>{item.name}</button>
                  <div className="t-xs t-muted" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Icon.Check size={11} style={{ color: 'var(--success)' }}/>
                    <span>En stock · Despacho en 24h</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6 }}>
                      <button onClick={() => onUpdate(item.id, item.qty - 1)} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}><Icon.Minus size={12}/></button>
                      <span className="t-mono" style={{ padding: '0 14px', minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                      <button onClick={() => onUpdate(item.id, item.qty + 1)} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}><Icon.Plus size={12}/></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
                      <Icon.Trash size={12}/> Eliminar
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
                      <Icon.Heart size={12}/> Guardar
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {item.listPrice > item.price && (
                    <div className="t-xs t-dim" style={{ textDecoration: 'line-through', marginBottom: 2 }}>{formatCLP(item.listPrice * item.qty)}</div>
                  )}
                  <div className="t-h3" style={{ fontSize: 20 }}>{formatCLP(item.price * item.qty)}</div>
                  {item.qty > 1 && <div className="t-xs t-dim" style={{ marginTop: 2 }}>{formatCLP(item.price)} c/u</div>}
                  {item.listPrice > item.price && (
                    <div className="t-xs" style={{ marginTop: 6, color: 'var(--success)', fontWeight: 600 }}>
                      Ahorras {formatCLP((item.listPrice - item.price) * item.qty)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <RecommendedRow items={items} currentIds={currentIds} onAdd={onAdd}/>

          {/* Trust strip */}
          <div style={{ marginTop: 24, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
            {[
              { icon: 'Shield', t: 'Compra protegida', s: 'Garantía 12 meses' },
              { icon: 'Truck', t: 'Envío en todo Chile', s: 'Arica a Punta Arenas' },
              { icon: 'Check', t: 'Stock real', s: 'Ya reservado para ti' },
              { icon: 'Headset', t: 'Soporte experto', s: 'Lun–Sáb · WhatsApp' },
            ].map(b => {
              const I = Icon[b.icon] || Icon.Check;
              return (
                <div key={b.t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <I size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }}/>
                  <div>
                    <div className="t-sm" style={{ fontWeight: 600 }}>{b.t}</div>
                    <div className="t-xs t-muted">{b.s}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 140 }}>
            <h3 className="t-h3" style={{ fontSize: 18, marginBottom: 16 }}>Resumen del pedido</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="t-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t-muted">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} ítems)</span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Ahorro descuentos</span>
                  <span style={{ fontWeight: 600 }}>−{formatCLP(savings)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t-muted">IVA incluido</span>
                <span className="t-dim">{formatCLP(iva)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t-muted">Envío</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit', fontWeight: shipping === 0 ? 600 : 400 }}>
                  {shipping === 0 ? 'GRATIS' : formatCLP(shipping)}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600 }}>Total a pagar</span>
              <div style={{ textAlign: 'right' }}>
                <div className="t-h2" style={{ fontSize: 30 }}>{formatCLP(total)}</div>
                <div className="t-xs t-dim">o 3 cuotas de {formatCLP(Math.round(total / 3))} sin interés</div>
              </div>
            </div>

            <button onClick={() => onNav('checkout')} className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20, fontSize: 15 }}>
              <Icon.Lock size={14}/> Ir a pagar seguro
            </button>

            {/* Coupon */}
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon.Tag size={14} style={{ color: 'var(--primary)' }}/>
              <input className="input" placeholder="Código de descuento" style={{ background: 'transparent', border: 'none', padding: 0, flex: 1, fontSize: 13 }}/>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>Aplicar</button>
            </div>

            {/* Payment methods */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div className="t-xs t-dim" style={{ marginBottom: 8 }}>Aceptamos</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['VISA', 'MC', 'AMEX', 'WBP', 'MP', 'KHI'].map(m => <PaymentChip key={m} kind={m}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment chip — small visual badge for cards/processors
const PaymentChip = ({ kind, big }) => {
  const sizes = big ? { w: 56, h: 36, fs: 11 } : { w: 40, h: 26, fs: 9 };
  const palette = {
    VISA: { bg: '#1a1f71', fg: '#fff', label: 'VISA' },
    MC: { bg: 'linear-gradient(90deg, #eb001b 50%, #f79e1b 50%)', fg: '#fff', label: 'MC' },
    AMEX: { bg: '#006fcf', fg: '#fff', label: 'AMEX' },
    WBP: { bg: '#ee2724', fg: '#fff', label: 'Webpay' },
    MP: { bg: '#00b1ea', fg: '#fff', label: 'MercadoPago' },
    KHI: { bg: '#000', fg: '#fff', label: 'Khipu' },
    REDC: { bg: '#003a70', fg: '#fff', label: 'Redcompra' },
  };
  const p = palette[kind] || palette.VISA;
  return (
    <div style={{ width: sizes.w, height: sizes.h, borderRadius: 4, background: p.bg, color: p.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: sizes.fs, fontWeight: 800, letterSpacing: '0.02em', textShadow: '0 1px 1px rgba(0,0,0,0.3)' }}>
      {p.label}
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// CHECKOUT — multi-step with CL payment methods
// ───────────────────────────────────────────────────────────

const CheckoutPage = ({ onNav, items, user, address }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    shipping: 'delivery',
    payment: 'webpay',
    invoice: 'boleta',
    cardBrand: 'visa',
    installments: '1',
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const iva = Math.round(subtotal * 0.19);
  const shippingCost = data.shipping === 'pickup' ? 0 : data.shipping === 'express' ? 14990 : (subtotal > 100000 ? 0 : 8990);
  const total = subtotal + shippingCost;

  const steps = ['Identificación', 'Envío', 'Pago', 'Confirmar'];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      <button onClick={() => onNav('cart')} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Volver al carrito
      </button>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="t-h1" style={{ fontSize: 36 }}>Checkout</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)' }}>
          <Icon.Lock size={14}/>
          <span className="t-sm" style={{ fontWeight: 600 }}>Conexión segura · SSL 256-bit</span>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button onClick={() => i < step && setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: i < step ? 'pointer' : 'default' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i <= step ? 'var(--primary)' : 'var(--surface-2)',
                color: i <= step ? '#fff' : 'var(--text-muted)',
                boxShadow: i === step ? `0 0 0 4px var(--primary-soft)` : 'none',
                fontWeight: 600, fontSize: 13, transition: 'all 0.2s'
              }}>
                {i < step ? <Icon.Check size={14}/> : i + 1}
              </div>
              <span className="t-sm" style={{ fontWeight: i === step ? 600 : 400, color: i <= step ? 'var(--text)' : 'var(--text-muted)' }}>{s}</span>
            </button>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--primary)' : 'var(--border)', margin: '0 16px', transition: 'background 0.3s' }}></div>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32, alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 32 }}>
          {step === 0 && <StepIdentification data={data} setData={setData} user={user}/>}
          {step === 1 && <StepShipping data={data} setData={setData} subtotal={subtotal} address={address}/>}
          {step === 2 && <StepPayment data={data} setData={setData} total={total}/>}
          {step === 3 && <StepConfirm data={data} items={items} total={total} address={address}/>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button onClick={() => step > 0 ? setStep(step-1) : onNav('cart')} className="btn btn-secondary">
              <Icon.ChevronLeft size={14}/> Atrás
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(step+1)} className="btn btn-primary">
                Continuar <Icon.ChevronRight size={14}/>
              </button>
            ) : (
              <button onClick={() => onNav('order-success', { total, items })} className="btn btn-primary btn-lg">
                <Icon.Lock size={14}/> Pagar {formatCLP(total)}
              </button>
            )}
          </div>
        </div>

        {/* Sticky summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 140 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Tu pedido</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
            {items.map(i => (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                  <ProductImg kind={i.image}/>
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i.qty}</div>
                </div>
                <div className="t-xs" style={{ lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                <div className="t-xs t-mono" style={{ fontWeight: 600 }}>{formatCLP(i.price * i.qty)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }} className="t-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="t-muted">Subtotal</span><span>{formatCLP(subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="t-muted">IVA</span><span className="t-dim">{formatCLP(iva)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="t-muted">Envío</span>
              <span style={{ color: shippingCost === 0 ? 'var(--success)' : 'inherit', fontWeight: shippingCost === 0 ? 600 : 400 }}>
                {shippingCost === 0 ? 'GRATIS' : formatCLP(shippingCost)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <span className="t-h2" style={{ fontSize: 26 }}>{formatCLP(total)}</span>
          </div>

          {/* Trust signals */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: 'Lock', t: 'Pago 100% seguro' },
              { icon: 'Shield', t: 'Garantía 12 meses' },
              { icon: 'Truck', t: 'Envío trackeable' },
            ].map(b => {
              const I = Icon[b.icon] || Icon.Check;
              return (
                <div key={b.t} className="t-xs t-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <I size={12} style={{ color: 'var(--success)' }}/>
                  <span>{b.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Step 0: Identification ───────────────────────────────
const StepIdentification = ({ data, setData, user }) => {
  const [mode, setMode] = React.useState(user ? 'logged' : 'guest');
  return (
    <div>
      <h2 className="t-h3" style={{ fontSize: 20, marginBottom: 6 }}>Identificación</h2>
      <p className="t-sm t-muted" style={{ marginBottom: 20 }}>Necesitamos tus datos para emitir el documento y enviar el pedido.</p>

      {!user && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 4, background: 'var(--surface-2)', borderRadius: 8 }}>
          {[{id:'guest', t: 'Comprar como invitado'}, {id:'login', t: 'Tengo cuenta'}].map(o => (
            <button key={o.id} onClick={() => setMode(o.id)} className="btn btn-sm" style={{ flex: 1, background: mode === o.id ? 'var(--surface)' : 'transparent', boxShadow: mode === o.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
              {o.t}
            </button>
          ))}
        </div>
      )}

      {user && (
        <div style={{ padding: 14, background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Conectado como {user.name}</div>
            <div className="t-xs t-muted">{user.email} · {user.company}</div>
          </div>
          <button className="btn btn-ghost btn-sm">Cambiar</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div><label className="t-sm t-muted">Nombre</label><input className="input" defaultValue={user ? 'Juan' : ''} placeholder="Carlos" style={{ marginTop: 4 }}/></div>
        <div><label className="t-sm t-muted">Apellido</label><input className="input" defaultValue={user ? 'Peña' : ''} placeholder="Mendoza" style={{ marginTop: 4 }}/></div>
        <div><label className="t-sm t-muted">RUT</label><input className="input" defaultValue={user ? '12.345.678-9' : ''} placeholder="12.345.678-9" style={{ marginTop: 4 }}/></div>
        <div><label className="t-sm t-muted">Teléfono</label><input className="input" defaultValue={user ? '+56 9 8765 4321' : ''} placeholder="+56 9 ..." style={{ marginTop: 4 }}/></div>
        <div style={{ gridColumn: 'span 2' }}><label className="t-sm t-muted">Email</label><input className="input" defaultValue={user ? user.email : ''} placeholder="tu@email.cl" style={{ marginTop: 4 }}/></div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="t-sm t-muted" style={{ marginBottom: 8 }}>Documento tributario</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { id: 'boleta', t: 'Boleta', s: 'Compra personal' },
            { id: 'factura', t: 'Factura', s: 'Empresa con RUT' },
          ].map(o => (
            <label key={o.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderColor: data.invoice === o.id ? 'var(--primary)' : 'var(--border)', borderWidth: data.invoice === o.id ? 2 : 1 }}>
              <input type="radio" name="inv" checked={data.invoice === o.id} onChange={() => setData({...data, invoice: o.id})}/>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.t}</div>
                <div className="t-xs t-muted">{o.s}</div>
              </div>
            </label>
          ))}
        </div>
        {data.invoice === 'factura' && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label className="t-sm t-muted">Razón social</label><input className="input" defaultValue={user ? user.company : ''} style={{ marginTop: 4 }}/></div>
            <div><label className="t-sm t-muted">Giro</label><input className="input" placeholder="Transporte de carga" style={{ marginTop: 4 }}/></div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Step 1: Shipping ───────────────────────────────
const StepShipping = ({ data, setData, subtotal, address }) => {
  const options = [
    { id: 'delivery', t: 'Despacho a domicilio', s: 'Llega martes 28 abr · Starken', p: subtotal > 100000 ? 'GRATIS' : '$8.990', icon: 'Truck' },
    { id: 'express', t: 'Despacho express 24h', s: 'Llega mañana antes 18h · Blue Express', p: '$14.990', icon: 'Bolt' },
    { id: 'pickup', t: 'Retiro en sucursal', s: 'Disponible HOY en 12 puntos · Sin costo', p: 'GRATIS', icon: 'Pin' },
    { id: 'flota', t: 'Despacho a flota (B2B)', s: 'Coordinado con tu kam · 2 días hábiles', p: 'GRATIS', icon: 'Building', badge: 'B2B' },
  ];
  return (
    <div>
      <h2 className="t-h3" style={{ fontSize: 20, marginBottom: 6 }}>Método de envío</h2>
      <p className="t-sm t-muted" style={{ marginBottom: 20 }}>Elige cómo prefieres recibir tu pedido.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(o => {
          const I = Icon[o.icon] || Icon.Truck;
          const selected = data.shipping === o.id;
          return (
            <label key={o.id} className="card" style={{ padding: 16, display: 'grid', gridTemplateColumns: 'auto 36px 1fr auto', gap: 14, alignItems: 'center', cursor: 'pointer', borderColor: selected ? 'var(--primary)' : 'var(--border)', borderWidth: selected ? 2 : 1, background: selected ? 'var(--primary-soft)' : 'var(--surface)' }}>
              <input type="radio" name="ship" checked={selected} onChange={() => setData({...data, shipping: o.id})}/>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: selected ? 'var(--primary)' : 'var(--surface-2)', color: selected ? '#fff' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I size={16}/>
              </div>
              <div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {o.t}
                  {o.badge && <Badge kind="primary">{o.badge}</Badge>}
                </div>
                <div className="t-sm t-muted">{o.s}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: o.p === 'GRATIS' ? 'var(--success)' : 'var(--text)' }}>{o.p}</div>
            </label>
          );
        })}
      </div>

      {data.shipping !== 'pickup' && (
        <div style={{ marginTop: 24 }}>
          <div className="t-sm" style={{ fontWeight: 600, marginBottom: 10 }}>Dirección de envío</div>
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon.Pin size={16} style={{ color: 'var(--primary)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{address?.label || 'Casa'}</div>
              <div className="t-sm t-muted">{address?.line1 || 'Av. Apoquindo 5950, dpto 802'} · {address?.commune || 'Las Condes'}</div>
            </div>
            <button className="btn btn-secondary btn-sm">Cambiar</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="t-sm t-muted">Indicaciones para el repartidor (opcional)</label>
            <textarea className="input" rows="2" placeholder="Ej: dejar en conserjería" style={{ marginTop: 4, resize: 'vertical' }}/>
          </div>
        </div>
      )}

      {data.shipping === 'pickup' && (
        <div style={{ marginTop: 24 }}>
          <div className="t-sm" style={{ fontWeight: 600, marginBottom: 10 }}>Sucursal de retiro</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
            {window.MOCK.STORES.slice(0, 5).map((s, i) => (
              <label key={s.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderColor: i === 0 ? 'var(--primary)' : 'var(--border)' }}>
                <input type="radio" name="store" defaultChecked={i === 0}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div className="t-xs t-muted">{s.address}</div>
                </div>
                <div className="t-xs" style={{ color: 'var(--success)', fontWeight: 600 }}>{s.eta}</div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Step 2: Payment ───────────────────────────────
const StepPayment = ({ data, setData, total }) => {
  const methods = [
    { id: 'webpay', t: 'Webpay Plus', s: 'Tarjetas de crédito y débito · Transbank', tags: ['VISA', 'MC', 'AMEX', 'REDC'] },
    { id: 'mercadopago', t: 'Mercado Pago', s: 'Tarjeta, saldo o cuotas sin interés', tags: ['MP'] },
    { id: 'khipu', t: 'Transferencia con Khipu', s: 'Pago directo desde tu banco · Inmediato', tags: ['KHI'] },
    { id: 'transfer', t: 'Transferencia manual', s: 'Confirma en 1-2 horas hábiles' },
    { id: 'credit', t: 'Crédito empresa (30 días)', s: 'Cuenta B2B · Cupo disponible $2.500.000', badge: 'B2B' },
  ];
  return (
    <div>
      <h2 className="t-h3" style={{ fontSize: 20, marginBottom: 6 }}>Método de pago</h2>
      <p className="t-sm t-muted" style={{ marginBottom: 20 }}>Todos los pagos están protegidos con SSL y validación bancaria.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {methods.map(o => {
          const selected = data.payment === o.id;
          return (
            <label key={o.id} className="card" style={{ padding: 16, cursor: 'pointer', borderColor: selected ? 'var(--primary)' : 'var(--border)', borderWidth: selected ? 2 : 1, background: selected ? 'var(--primary-soft)' : 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <input type="radio" name="pay" checked={selected} onChange={() => setData({...data, payment: o.id})}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {o.t}
                    {o.badge && <Badge kind="primary">{o.badge}</Badge>}
                  </div>
                  <div className="t-sm t-muted">{o.s}</div>
                </div>
                {o.tags && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {o.tags.map(t => <PaymentChip key={t} kind={t}/>)}
                  </div>
                )}
              </div>

              {/* Inline card form */}
              {selected && o.id === 'webpay' && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="t-sm t-muted">Número de tarjeta</label>
                      <div style={{ position: 'relative', marginTop: 4 }}>
                        <input className="input" placeholder="•••• •••• •••• ••••" style={{ paddingRight: 60 }}/>
                        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          <PaymentChip kind="VISA"/>
                        </div>
                      </div>
                    </div>
                    <div><label className="t-sm t-muted">Titular</label><input className="input" placeholder="Como aparece en tarjeta" style={{ marginTop: 4 }}/></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div><label className="t-sm t-muted">Vence</label><input className="input" placeholder="MM/AA" style={{ marginTop: 4 }}/></div>
                      <div><label className="t-sm t-muted">CVV</label><input className="input" placeholder="•••" style={{ marginTop: 4 }}/></div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="t-sm t-muted">Cuotas</label>
                      <select value={data.installments} onChange={e => setData({...data, installments: e.target.value})} className="input" style={{ marginTop: 4 }}>
                        <option value="1">1 cuota · {formatCLP(total)} (sin interés)</option>
                        <option value="3">3 cuotas · {formatCLP(Math.round(total/3))} c/u (sin interés)</option>
                        <option value="6">6 cuotas · {formatCLP(Math.round(total/6))} c/u (sin interés)</option>
                        <option value="12">12 cuotas · {formatCLP(Math.round(total/12 * 1.05))} c/u (CAE 14.9%)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selected && o.id === 'transfer' && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--surface-2)', borderRadius: 8 }}>
                  <div className="t-xs t-mono t-dim" style={{ marginBottom: 8 }}>DATOS BANCARIOS</div>
                  <div className="t-sm" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px', fontFamily: 'var(--font-mono)' }}>
                    <span className="t-muted">Banco</span><span>BCI</span>
                    <span className="t-muted">Cuenta corriente</span><span>13 245 8970 84</span>
                    <span className="t-muted">RUT</span><span>76.143.892-K</span>
                    <span className="t-muted">A nombre</span><span>Implementos S.A.</span>
                    <span className="t-muted">Email</span><span>pagos@implementos.cl</span>
                  </div>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

// ── Step 3: Confirm ───────────────────────────────
const StepConfirm = ({ data, items, total, address }) => {
  const labelMap = {
    webpay: 'Webpay Plus · Tarjeta de crédito',
    mercadopago: 'Mercado Pago',
    khipu: 'Transferencia con Khipu',
    transfer: 'Transferencia bancaria manual',
    credit: 'Crédito empresa (30 días)',
  };
  const shipMap = {
    delivery: 'Despacho a domicilio',
    express: 'Express 24h',
    pickup: 'Retiro en sucursal',
    flota: 'Despacho a flota B2B',
  };
  return (
    <div>
      <h2 className="t-h3" style={{ fontSize: 20, marginBottom: 6 }}>Confirma tu pedido</h2>
      <p className="t-sm t-muted" style={{ marginBottom: 20 }}>Revisa los detalles antes de pagar.</p>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="t-eyebrow">ENVÍO</div>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Editar</button>
          </div>
          <div className="t-sm" style={{ fontWeight: 600 }}>{shipMap[data.shipping]}</div>
          <div className="t-sm t-muted">{address?.line1 || 'Av. Apoquindo 5950'} · {address?.commune || 'Las Condes'}</div>
        </div>

        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="t-eyebrow">PAGO</div>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Editar</button>
          </div>
          <div className="t-sm" style={{ fontWeight: 600 }}>{labelMap[data.payment]}</div>
          <div className="t-sm t-muted">{data.invoice === 'factura' ? 'Factura electrónica' : 'Boleta'}</div>
        </div>

        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>PRODUCTOS ({items.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(i => (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden' }}><ProductImg kind={i.image}/></div>
                <div className="t-sm">{i.name} <span className="t-dim">× {i.qty}</span></div>
                <div className="t-sm" style={{ fontWeight: 600 }}>{formatCLP(i.price * i.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 0', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ marginTop: 3 }}/>
          <span className="t-sm">Acepto los <a style={{ color: 'var(--primary)', textDecoration: 'underline' }}>términos y condiciones</a> y la <a style={{ color: 'var(--primary)', textDecoration: 'underline' }}>política de privacidad</a> de Implementos.</span>
        </label>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// ORDER SUCCESS PAGE
// ───────────────────────────────────────────────────────────

const OrderSuccessPage = ({ onNav, params }) => {
  const orderNum = `IMP-2026-0${Math.floor(Math.random() * 9000 + 1000)}`;
  const eta = new Date();
  eta.setDate(eta.getDate() + 2);
  const etaStr = eta.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 32 }}>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 20px', borderRadius: '50%', background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'successPop 0.5s ease-out' }}>
          <Icon.Check size={36}/>
        </div>
        <h1 className="t-h1" style={{ fontSize: 32, marginBottom: 8 }}>¡Pedido confirmado!</h1>
        <p className="t-muted" style={{ fontSize: 15, marginBottom: 8 }}>Te enviamos los detalles por email a juan@transportesandes.cl</p>
        <div className="t-mono t-sm" style={{ marginBottom: 32, color: 'var(--primary)', fontWeight: 600 }}>N° {orderNum}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { icon: 'Mail', t: 'Email enviado', s: 'Confirmación' },
            { icon: 'Truck', t: 'Despacho preparándose', s: etaStr },
            { icon: 'Headset', t: '¿Dudas?', s: 'WhatsApp soporte' },
          ].map(b => {
            const I = Icon[b.icon] || Icon.Check;
            return (
              <div key={b.t} style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
                <I size={20} style={{ color: 'var(--primary)', marginBottom: 6 }}/>
                <div className="t-sm" style={{ fontWeight: 600 }}>{b.t}</div>
                <div className="t-xs t-muted">{b.s}</div>
              </div>
            );
          })}
        </div>

        {/* Tracking timeline preview */}
        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 8, marginBottom: 24, textAlign: 'left' }}>
          <div className="t-eyebrow" style={{ marginBottom: 14 }}>SEGUIMIENTO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { t: 'Pedido recibido', s: 'Hace 1 minuto', done: true, active: true },
              { t: 'Preparando en bodega', s: 'En las próximas 4 horas', done: false },
              { t: 'En camino', s: 'Mañana', done: false },
              { t: 'Entregado', s: etaStr, done: false },
            ].map((s, i, arr) => (
              <div key={s.t} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: s.active ? 'var(--success)' : (s.done ? 'var(--primary)' : 'var(--border-strong)'), boxShadow: s.active ? '0 0 0 4px var(--primary-soft)' : 'none', marginTop: 2, flexShrink: 0 }}/>
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: s.done ? 'var(--primary)' : 'var(--border)', marginTop: 2 }}/>}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: s.active ? 600 : 500, color: s.done ? 'var(--text)' : 'var(--text-muted)' }}>{s.t}</div>
                  <div className="t-xs t-dim">{s.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => onNav('account')} className="btn btn-primary">Ver mi pedido</button>
          <button onClick={() => onNav('home')} className="btn btn-secondary">Seguir comprando</button>
        </div>
      </div>
    </div>
  );
};

window.CartPage = CartPage;
window.CheckoutPage = CheckoutPage;
window.OrderSuccessPage = OrderSuccessPage;
