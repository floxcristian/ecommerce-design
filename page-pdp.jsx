// PDP - Product Detail Page
const { ProductImg, formatCLP, computePPU, formatPPU, Rating, Badge } = window.UI;
const { ProductCard } = window.Catalog;
const { ZoomGallery, BundleSection, ShippingCalculator, QASection, TrustCard, VolumeQtyPicker } = window.PDPx;

const PDPPage = ({ onNav, onAdd, vehicle, productId, store }) => {
  const product = window.MOCK.PRODUCTS.find(p => p.id === productId) || window.MOCK.PRODUCTS[0];
  const [tab, setTab] = React.useState('specs');
  const [imgIdx, setImgIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  
  React.useEffect(() => {
    if (product?.id && window.trackProductView) window.trackProductView(product.id);
  }, [product?.id]);
  
  const images = [product.image, product.image, product.image, product.image];
  const related = window.MOCK.PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = Math.round((1 - product.price / product.listPrice) * 100);
  const ppu = computePPU(product);

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 32px' }}>
      {/* Breadcrumb */}
      <div className="t-xs t-mono t-dim" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, letterSpacing: '0.04em' }}>
        <button onClick={() => onNav('home')}>INICIO</button>
        <Icon.ChevronRight size={10}/>
        <button onClick={() => onNav('category', { cat: product.category })}>{product.category.toUpperCase()}</button>
        <Icon.ChevronRight size={10}/>
        <span style={{ color: 'var(--text)' }}>{product.brand.toUpperCase()}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48 }}>
        {/* Gallery */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className="card" style={{
                  aspectRatio: 1, overflow: 'hidden', padding: 0,
                  borderColor: imgIdx === i ? 'var(--primary)' : 'var(--border)',
                  borderWidth: imgIdx === i ? 2 : 1
                }}>
                  <ProductImg kind={img}/>
                </button>
              ))}
              <button className="card" style={{ aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, color: 'var(--text-muted)' }}>
                <Icon.Plus size={16}/>
                <span className="t-xs">+3</span>
              </button>
            </div>
            <ZoomGallery kind={images[imgIdx]} badge={product.badge}/>
          </div>

          {/* Tabs below */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
              {[
                { k: 'specs', l: 'Especificaciones' },
                { k: 'compat', l: 'Compatibilidad' },
                { k: 'reviews', l: `Reseñas (${product.reviews})` },
                { k: 'qa', l: 'Preguntas (24)' },
                { k: 'shipping', l: 'Envío y devolución' },
              ].map(t => (
                <button key={t.k} onClick={() => setTab(t.k)} style={{
                  padding: '14px 18px', fontSize: 13, fontWeight: tab === t.k ? 600 : 400,
                  color: tab === t.k ? 'var(--text)' : 'var(--text-muted)',
                  borderBottom: tab === t.k ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -1
                }}>{t.l}</button>
              ))}
            </div>
            <div style={{ padding: '24px 0' }}>
              {tab === 'specs' && (
                <div>
                  <p className="t-body" style={{ marginBottom: 24, color: 'var(--text-muted)', maxWidth: 700, lineHeight: 1.6 }}>{product.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
                    {[
                      ['SKU', product.sku],
                      ['Marca', product.brand],
                      ['Categoría', product.category],
                      ['Origen', 'Alemania'],
                      ['Peso', '1.2 kg'],
                      ['Garantía', '24 meses'],
                      ['Material', 'Acero inoxidable / Composite'],
                      ['Norma', 'ISO 9001 / OEM'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <span className="t-sm t-muted">{k}</span>
                        <span className="t-sm" style={{ fontWeight: 500, fontFamily: k === 'SKU' ? 'var(--font-mono)' : 'inherit' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'compat' && (
                <div>
                  <p className="t-sm t-muted" style={{ marginBottom: 16 }}>Este producto es compatible con los siguientes vehículos:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { brand: 'Mercedes-Benz', models: 'Actros 1844 (2019-2025), Actros 2545 (2020-2025), Atego 1726 (2018-2024)' },
                      { brand: 'Volvo', models: 'FH 460 (2018-2025), FM 420 (2019-2024)' },
                      { brand: 'Scania', models: 'R 450 (2017-2024), R 500 (2019-2025)' },
                    ].map(c => (
                      <div key={c.brand} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Icon.Truck size={20}/>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.brand}</div>
                          <div className="t-sm t-muted">{c.models}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'reviews' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, marginBottom: 32 }}>
                    <div style={{ textAlign: 'center', padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div className="t-display" style={{ fontSize: 56, lineHeight: 1 }}>{product.rating}</div>
                      <Rating value={product.rating} size={16}/>
                      <div className="t-xs t-muted" style={{ marginTop: 8 }}>Basado en {product.reviews} reseñas</div>
                    </div>
                    <div>
                      {[5,4,3,2,1].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                          <span className="t-sm t-mono" style={{ width: 16 }}>{s}</span>
                          <div style={{ flex: 1, height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${[78, 15, 4, 2, 1][5-s]}%`, height: '100%', background: 'var(--primary)' }}></div>
                          </div>
                          <span className="t-xs t-muted" style={{ width: 32, textAlign: 'right' }}>{[78, 15, 4, 2, 1][5-s]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { name: 'Rodrigo M.', role: 'Mecánico independiente · Maipú', rating: 5, date: 'hace 2 semanas', title: 'Calza perfecto en mi Actros', body: 'Pedí el filtro y me llegó al día siguiente a Maipú. Calzó sin problemas en el Actros 1844 del 2020. Ya pedí 4 más para el resto de la flota.', verified: true, helpful: 18 },
                      { name: 'Camila P.', role: 'Gerenta de Operaciones · Transportes Andes', rating: 5, date: 'hace 1 mes', title: 'Excelente para flota', body: 'Compramos por volumen para los 22 camiones de la empresa. El descuento por escala vale completamente la pena. Facturación electrónica al instante.', verified: true, helpful: 12 },
                      { name: 'Felipe C.', role: 'Taller mecánico · Antofagasta', rating: 4, date: 'hace 2 meses', title: 'Buena calidad, despacho podría mejorar', body: 'Producto OEM de calidad, sello de fábrica intacto. Lo único: el despacho a Antofagasta tomó 4 días, esperaba 48h.', verified: true, helpful: 5 },
                    ].map((r, i) => (
                      <div key={i} className="card" style={{ padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                            {r.name[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                              {r.verified && <span className="t-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 6px', background: 'rgba(0,210,106,0.12)', color: 'var(--success)', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}><Icon.Check size={9}/> COMPRA VERIFICADA</span>}
                            </div>
                            <div className="t-xs t-muted" style={{ marginTop: 1 }}>{r.role}</div>
                          </div>
                          <Rating value={r.rating} size={12}/>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                        <p className="t-sm t-muted" style={{ lineHeight: 1.55 }}>{r.body}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                          <span className="t-xs t-dim">{r.date}</span>
                          <span style={{ flex: 1 }}/>
                          <button className="t-xs" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Icon.ThumbsUp size={11}/> Útil ({r.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'qa' && <QASection product={product}/>}
              {tab === 'shipping' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    { i: Icon.Truck, t: `Despacho ${store?.eta || '24h'}`, d: `Desde ${store?.name || 'Santiago Centro'}. Pedidos antes de las 16:00 se despachan el mismo día.` },
                    { i: Icon.Package, t: 'Retiro en sucursal', d: 'Disponible en 12 sucursales a nivel nacional' },
                    { i: Icon.Shield, t: 'Garantía 24 meses', d: 'Garantía oficial del fabricante. Cubre defectos de fábrica.' },
                    { i: Icon.Bolt, t: 'Devolución 30 días', d: 'Devolución sin costo si el producto no es el correcto' },
                  ].map(b => (
                    <div key={b.t} className="card" style={{ padding: 20, display: 'flex', gap: 16 }}>
                      <b.i size={20}/>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.t}</div>
                        <div className="t-sm t-muted">{b.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — buy box */}
        <div id="pdp-buybox" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="t-xs t-mono t-dim">{product.brand.toUpperCase()}</span>
              <span className="t-xs t-mono t-dim">·</span>
              <span className="t-xs t-mono t-dim">SKU {product.sku}</span>
            </div>
            <h1 className="t-h1" style={{ fontSize: 32, marginBottom: 12 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Rating value={product.rating} count={product.reviews} size={14}/>
              <span className="t-xs t-dim">·</span>
              <span className="t-xs" style={{ color: 'var(--success)' }}>● {Math.round(product.stock * (store?.stockHealth || 1))} en stock {store ? `· ${store.name}` : ''}</span>
            </div>
          </div>

          {/* Vehicle compatibility */}
          {vehicle && (
            <div className="card" style={{ padding: 14, background: product.fitsVehicle ? 'rgba(0,210,106,0.08)' : 'rgba(255,176,32,0.08)', borderColor: product.fitsVehicle ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {product.fitsVehicle ? <Icon.Check size={18}/> : <Icon.Bolt size={18}/>}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {product.fitsVehicle ? 'Compatible con tu vehículo' : 'Compatibilidad no confirmada'}
                </div>
                <div className="t-xs t-muted">{vehicle.brand} {vehicle.model} {vehicle.year}</div>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
              <span className="t-display" style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>{formatCLP(product.price)}</span>
              {discount > 0 && <Badge kind="warning">-{discount}%</Badge>}
            </div>
            {product.listPrice > product.price && (
              <div className="t-sm t-dim" style={{ textDecoration: 'line-through', marginBottom: ppu ? 6 : 12 }}>{formatCLP(product.listPrice)}</div>
            )}
            {ppu && (
              <div className="t-xs t-mono" style={{ marginBottom: 12, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                <span style={{ color: 'var(--text-dim)' }}>PRECIO POR UNIDAD</span> · {formatPPU(ppu)} <span style={{ color: 'var(--text-dim)' }}>(envase {ppu.base})</span>
              </div>
            )}
            <div className="t-xs t-mono t-dim" style={{ marginBottom: 20 }}>NETO {formatCLP(Math.round(product.price/1.19))} · IVA {formatCLP(product.price - Math.round(product.price/1.19))}</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8 }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} className="btn btn-ghost" style={{ padding: '12px 14px' }}><Icon.Minus size={14}/></button>
                <span className="t-mono" style={{ padding: '0 16px', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} className="btn btn-ghost" style={{ padding: '12px 14px' }}><Icon.Plus size={14}/></button>
              </div>
              <button onClick={(e) => { window.flyToCart && window.flyToCart(e); onAdd(product, qty); }} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <Icon.Cart size={16}/> Agregar al carrito
              </button>
            </div>
            <button className="btn btn-secondary btn-block btn-lg">Comprar ahora</button>

            <VolumeQtyPicker product={product} qty={qty} setQty={setQty}/>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { i: Icon.Truck, l: 'Despacho 24h a Santiago', s: 'Llega el mar 28 abr' },
                { i: Icon.Package, l: 'Retiro gratis en Quilicura', s: 'Disponible hoy' },
                { i: Icon.Shield, l: 'Garantía 24 meses', s: 'Por el fabricante' },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <r.i size={16}/>
                  <div style={{ flex: 1 }}>
                    <div className="t-sm" style={{ fontWeight: 500 }}>{r.l}</div>
                    <div className="t-xs t-muted">{r.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ShippingCalculator product={product}/>
          <TrustCard/>

          <button className="btn btn-secondary btn-block">
            <Icon.Compare size={14}/> Agregar al comparador
          </button>
        </div>
      </div>

      {window.StickyPDPBar && <window.StickyPDPBar product={product} qty={qty} onAdd={onAdd}/>}

      <BundleSection product={product} onAdd={onAdd}/>

      {/* Related */}
      <section style={{ marginTop: 80 }}>
        <div className="t-eyebrow">PRODUCTOS RELACIONADOS</div>
        <h2 className="t-h2" style={{ marginTop: 8, marginBottom: 24 }}>Otros mecánicos también compraron</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {related.map(p => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd}/>)}
        </div>
      </section>
    </div>
  );
};

window.PDPPage = PDPPage;
