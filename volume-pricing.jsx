// Volume pricing — wholesale/mayorista indicator + tier table popover.
// Click "Ver precios por volumen" to see tiered pricing without leaving the card.
const { formatCLP: vpFormatCLP } = window.UI;

const VolumePricingBadge = ({ product, compact = false }) => {
  const [open, setOpen] = React.useState(false);
  const tiers = window.MOCK.computeVolumeTiers(product);
  if (!tiers) return null;
  const maxDiscount = Math.max(...tiers.map(t => t.discount));
  const maxOff = Math.round(maxDiscount * 100);

  const formatRange = (t) => {
    if (t.max === null) return `${t.min}+ u.`;
    if (t.min === t.max) return `${t.min} u.`;
    return `${t.min}–${t.max} u.`;
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="vp-trigger"
        title="Ver precios por volumen"
      >
        <Icon.Package size={11}/>
        <span>Hasta <strong>-{maxOff}%</strong> por volumen</span>
        <Icon.ChevronRight size={10} style={{ marginLeft: 'auto', opacity: 0.6 }}/>
      </button>

      {open && ReactDOM.createPortal(
        <div
          className="vp-modal-backdrop"
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="vp-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div className="t-eyebrow" style={{ color: 'var(--primary)' }}>PRECIO POR VOLUMEN</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {product.name}
                </h3>
              </div>
              <button onClick={() => setOpen(false)} className="vp-close" aria-label="Cerrar">
                <Icon.Close size={16}/>
              </button>
            </div>
            <div className="t-xs t-mono t-dim" style={{ marginBottom: 16 }}>SKU {product.sku}</div>

            <table className="vp-table">
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Precio unit.</th>
                  <th>Ahorro</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t, i) => {
                  const isLast = i === tiers.length - 1;
                  const sampleQty = t.max ?? t.min;
                  return (
                    <tr key={i} className={isLast ? 'vp-row-best' : ''}>
                      <td><strong>{formatRange(t)}</strong></td>
                      <td>{vpFormatCLP(t.price)}</td>
                      <td>{t.discount === 0 ? <span className="t-dim">—</span> : <span style={{ color: 'var(--success)', fontWeight: 600 }}>-{Math.round(t.discount * 100)}%</span>}</td>
                      <td className="t-mono">{vpFormatCLP(t.price * sampleQty)}{isLast ? '+' : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="vp-footer">
              <div className="vp-footer-card">
                <Icon.Truck size={16} style={{ color: 'var(--primary)' }}/>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Despacho gratis sobre $250.000</div>
                  <div className="t-xs t-dim">Llega en 24–48h en RM</div>
                </div>
              </div>
              <div className="vp-footer-card">
                <Icon.Briefcase size={16} style={{ color: 'var(--primary)' }}/>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Cuenta empresa B2B</div>
                  <div className="t-xs t-dim">Crédito y descuentos personalizados <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)' }}>Solicitar</a></div>
                </div>
              </div>
            </div>

            <div className="vp-cta-row">
              <button className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cerrar</button>
              <button className="btn btn-primary btn-sm" onClick={(e) => { setOpen(false); }}>
                <Icon.Phone size={14}/> Cotizar mayor cantidad
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

window.VolumePricing = { VolumePricingBadge };
