// CATEGORY / PLP — enhanced with quick filters, shop-by-vehicle, rich facets
const { ProductCard } = window.Catalog;
const { Badge, formatCLP, computePPU, formatPPU } = window.UI;

const FilterSection = ({ title, children, defaultOpen = true, count }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: open ? 12 : 0 }}>
        <span style={{ fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
          {count && <span className="t-dim" style={{ marginLeft: 6, fontWeight: 400 }}>({count})</span>}
        </span>
        <Icon.ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}/>
      </button>
      {open && children}
    </div>
  );
};

const FilterCheck = ({ label, count, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 13 }}>
    <span style={{
      width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--primary)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {checked && <Icon.Check size={11} style={{ color: '#fff' }}/>}
    </span>
    <span style={{ flex: 1 }}>{label}</span>
    {count !== undefined && count !== '' && <span className="t-xs t-dim">{count}</span>}
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }}/>
  </label>
);

// Compatibility chip — shop by vehicle
const CompatibilityChip = ({ vehicle, onChange, onClear }) => {
  if (!vehicle) {
    return (
      <button onClick={onChange} className="card lift" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--surface-2)', border: '1.5px dashed var(--border-strong)', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Car size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div className="t-sm" style={{ fontWeight: 600 }}>Filtrar por mi vehículo</div>
          <div className="t-xs t-muted">Marca · Modelo · Año</div>
        </div>
        <Icon.ChevronRight size={14}/>
      </button>
    );
  }
  return (
    <div className="card" style={{ padding: 12, background: 'var(--primary-soft)', borderColor: 'var(--primary)', borderWidth: 1.5 }}>
      <div className="t-xs t-mono" style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>FILTRADO PARA</div>
      <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{vehicle.brand} {vehicle.model}</div>
      <div className="t-xs t-muted" style={{ marginTop: 2 }}>{vehicle.year} · {vehicle.alias || vehicle.plate}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <button onClick={onChange} className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: 11 }}>Cambiar</button>
        <button onClick={onClear} className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Quitar</button>
      </div>
    </div>
  );
};

// Quick filter pills — top of grid
const QuickFilterPills = ({ filters, setFilters }) => {
  const pills = [
    { id: 'fits', label: 'Compatible', icon: 'Car', value: filters.onlyFits, set: () => setFilters(f => ({ ...f, onlyFits: !f.onlyFits })) },
    { id: 'free-ship', label: 'Envío gratis', icon: 'Truck', value: filters.freeShip, set: () => setFilters(f => ({ ...f, freeShip: !f.freeShip })) },
    { id: 'in-stock', label: 'En stock', icon: 'Check', value: filters.inStock, set: () => setFilters(f => ({ ...f, inStock: !f.inStock })) },
    { id: 'sale', label: 'En oferta', icon: 'Tag', value: filters.onSale, set: () => setFilters(f => ({ ...f, onSale: !f.onSale })) },
    { id: 'oem', label: 'OEM original', icon: 'Shield', value: filters.oem, set: () => setFilters(f => ({ ...f, oem: !f.oem })) },
    { id: 'top-rated', label: '4★ y más', icon: 'Star', value: filters.topRated, set: () => setFilters(f => ({ ...f, topRated: !f.topRated })) },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {pills.map(p => {
        const I = Icon[p.icon] || Icon.Check;
        return (
          <button key={p.id} onClick={p.set} className={p.value ? 'chip chip-active' : 'chip'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <I size={12}/>
            {p.label}
          </button>
        );
      })}
    </div>
  );
};

const CategoryPage = ({ onNav, onAdd, vehicle, density, catId, onOpenVehicle, onClearVehicle }) => {
  const [view, setView] = React.useState('grid');
  const [sort, setSort] = React.useState('relevance');
  const [filters, setFilters] = React.useState({ brands: [], onlyFits: !!vehicle, freeShip: false, inStock: false, onSale: false, oem: false, topRated: false });

  const cat = window.MOCK.CATEGORIES.find(c => c.id === catId) || { name: 'Todos los productos', count: window.MOCK.PRODUCTS.length };

  let filtered = catId ? window.MOCK.PRODUCTS.filter(p => p.category === catId) : [...window.MOCK.PRODUCTS];
  if (filters.brands.length) filtered = filtered.filter(p => filters.brands.includes(p.brand));
  if (filters.onlyFits) filtered = filtered.filter(p => p.fitsVehicle);
  if (filters.onSale) filtered = filtered.filter(p => p.listPrice > p.price);
  if (filters.oem) filtered = filtered.filter(p => p.badge === 'OEM');
  if (filters.topRated) filtered = filtered.filter(p => p.rating >= 4);

  // Sorting
  const sorted = [...filtered];
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);

  const toggleBrand = (b) => setFilters(f => ({ ...f, brands: f.brands.includes(b) ? f.brands.filter(x => x !== b) : [...f.brands, b] }));
  const clearAll = () => setFilters({ brands: [], onlyFits: false, freeShip: false, inStock: false, onSale: false, oem: false, topRated: false });
  const activeCount = filters.brands.length + (filters.onlyFits ? 1 : 0) + (filters.onSale ? 1 : 0) + (filters.oem ? 1 : 0) + (filters.topRated ? 1 : 0) + (filters.inStock ? 1 : 0) + (filters.freeShip ? 1 : 0);

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 32px' }}>
      <div className="t-xs t-mono t-dim" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, letterSpacing: '0.04em' }}>
        <button onClick={() => onNav('home')}>INICIO</button>
        <Icon.ChevronRight size={10}/>
        <span>CATÁLOGO</span>
        {catId && <><Icon.ChevronRight size={10}/><span style={{ color: 'var(--text)' }}>{cat.name.toUpperCase()}</span></>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="t-h1" style={{ fontSize: 36 }}>{cat.name}</h1>
          <p className="t-muted" style={{ marginTop: 4 }}>
            <strong style={{ color: 'var(--text)' }}>{sorted.length}</strong> de {cat.count.toLocaleString('es-CL')} productos
            {vehicle && filters.onlyFits && <span> · Compatibles con <strong style={{ color: 'var(--primary)' }}>{vehicle.brand} {vehicle.model}</strong></span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input" style={{ width: 'auto' }}>
            <option value="relevance">Más relevantes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="rating">Mejor evaluados</option>
            <option value="new">Más nuevos</option>
            <option value="bestselling">Más vendidos</option>
          </select>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => setView('grid')} className="btn btn-ghost btn-sm" style={{ borderRadius: 0, background: view === 'grid' ? 'var(--surface-2)' : 'transparent' }}><Icon.Grid size={14}/></button>
            <button onClick={() => setView('list')} className="btn btn-ghost btn-sm" style={{ borderRadius: 0, background: view === 'list' ? 'var(--surface-2)' : 'transparent' }}><Icon.List size={14}/></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
        {/* Sidebar */}
        <aside>
          <CompatibilityChip vehicle={vehicle} onChange={onOpenVehicle} onClear={onClearVehicle}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 8px', marginTop: 14, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Filtros</span>
            {activeCount > 0 && <button onClick={clearAll} className="t-xs" style={{ color: 'var(--primary)', fontWeight: 600 }}>Limpiar ({activeCount})</button>}
          </div>

          <FilterSection title="Marca" count={20}>
            <div style={{ marginBottom: 8 }}>
              <input className="input" placeholder="Buscar marca…" style={{ fontSize: 12, padding: '6px 10px' }}/>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {window.MOCK.BRANDS.slice(0, 10).map(b => (
                <FilterCheck key={b} label={b} count={Math.floor(Math.random()*200)+10} checked={filters.brands.includes(b)} onChange={() => toggleBrand(b)}/>
              ))}
            </div>
            <button className="t-xs" style={{ color: 'var(--primary)', marginTop: 6, fontWeight: 600 }}>+ Ver más marcas (10)</button>
          </FilterSection>

          <FilterSection title="Precio">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <input className="input" placeholder="Min" style={{ fontSize: 12, padding: '6px 10px' }}/>
              <span className="t-dim t-xs">a</span>
              <input className="input" placeholder="Max" style={{ fontSize: 12, padding: '6px 10px' }}/>
            </div>
            {/* Mini histogram */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 32, marginBottom: 8 }}>
              {[8, 14, 22, 28, 24, 16, 10, 6, 4, 3].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 100 / 28}%`, background: 'var(--primary)', opacity: 0.6 + (i < 4 ? 0.4 : 0), borderRadius: 1 }}/>
              ))}
            </div>
            {['Hasta $20.000', '$20.000 - $50.000', '$50.000 - $100.000', '$100.000 - $250.000', 'Más de $250.000'].map(r => (
              <FilterCheck key={r} label={r} count={Math.floor(Math.random()*100)+5} checked={false} onChange={() => {}}/>
            ))}
          </FilterSection>

          <FilterSection title="Disponibilidad">
            <FilterCheck label="En stock ahora" count={342} checked={filters.inStock} onChange={() => setFilters(f => ({...f, inStock: !f.inStock}))}/>
            <FilterCheck label="Despacho 24h" count={198} checked={false} onChange={() => {}}/>
            <FilterCheck label="Retiro hoy en sucursal" count={87} checked={false} onChange={() => {}}/>
            <FilterCheck label="Envío gratis" count={156} checked={filters.freeShip} onChange={() => setFilters(f => ({...f, freeShip: !f.freeShip}))}/>
          </FilterSection>

          <FilterSection title="Tipo de producto" defaultOpen={false}>
            <FilterCheck label="OEM original" count={89} checked={filters.oem} onChange={() => setFilters(f => ({...f, oem: !f.oem}))}/>
            <FilterCheck label="Aftermarket" count={234} checked={false} onChange={() => {}}/>
            <FilterCheck label="Reacondicionado" count={42} checked={false} onChange={() => {}}/>
          </FilterSection>

          <FilterSection title="Evaluación" defaultOpen={false}>
            {[5,4,3,2].map(s => (
              <FilterCheck key={s} label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {[1,2,3,4,5].map(i => <Icon.Star key={i} size={12} filled={i <= s}/>)}
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>y más</span>
                </span>
              } count={Math.floor(Math.random()*100)} checked={false} onChange={() => {}}/>
            ))}
          </FilterSection>

          <FilterSection title="Tipo de vehículo" defaultOpen={false}>
            {['Camión pesado', 'Camioneta', 'Bus', 'Remolque', 'Maquinaria pesada', 'Auto particular'].map(v => (
              <FilterCheck key={v} label={v} count={Math.floor(Math.random()*150)} checked={false} onChange={() => {}}/>
            ))}
          </FilterSection>
        </aside>

        {/* Products column */}
        <div>
          <QuickFilterPills filters={filters} setFilters={setFilters}/>

          {/* Active filter chips */}
          {(filters.brands.length > 0 || filters.onlyFits || filters.onSale || filters.oem) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <span className="t-xs t-mono t-dim" style={{ alignSelf: 'center', marginRight: 4 }}>FILTROS ACTIVOS:</span>
              {filters.onlyFits && (
                <button onClick={() => setFilters(f => ({ ...f, onlyFits: false }))} className="chip chip-active">
                  Compatible <Icon.Close size={10}/>
                </button>
              )}
              {filters.brands.map(b => (
                <button key={b} onClick={() => toggleBrand(b)} className="chip chip-active">
                  {b} <Icon.Close size={10}/>
                </button>
              ))}
              {filters.onSale && <button onClick={() => setFilters(f => ({...f, onSale: false}))} className="chip chip-active">En oferta <Icon.Close size={10}/></button>}
              {filters.oem && <button onClick={() => setFilters(f => ({...f, oem: false}))} className="chip chip-active">OEM <Icon.Close size={10}/></button>}
              <button onClick={clearAll} className="t-xs" style={{ color: 'var(--text-muted)', textDecoration: 'underline', alignSelf: 'center', marginLeft: 6 }}>Limpiar todo</button>
            </div>
          )}

          {sorted.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }} className="card">
              <Icon.Search size={48} style={{ opacity: 0.3, marginBottom: 16 }}/>
              <h3 className="t-h3" style={{ marginBottom: 8 }}>No encontramos productos con esos filtros</h3>
              <p className="t-muted" style={{ marginBottom: 16 }}>Prueba relajando los filtros activos</p>
              <button onClick={clearAll} className="btn btn-primary">Limpiar filtros</button>
            </div>
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(var(--grid-min), 1fr))`, gap: 16 }}>
              {sorted.map(p => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} density={density}/>)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sorted.map(p => (
                <div key={p.id} className="card lift" onClick={() => onNav('pdp', { productId: p.id })} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, padding: 16, cursor: 'pointer' }}>
                  <div style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <window.UI.ProductImg kind={p.image}/>
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span className="t-xs t-mono t-dim">{p.brand.toUpperCase()} · {p.sku}</span>
                      {p.fitsVehicle && <Badge kind="success">Compatible</Badge>}
                      {p.badge && <Badge kind="primary">{p.badge}</Badge>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                    <p className="t-sm t-muted" style={{ marginBottom: 8, maxWidth: 600 }}>{p.description}</p>
                    <window.UI.Rating value={p.rating} count={p.reviews}/>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="t-h3">{formatCLP(p.price)}</div>
                      {p.listPrice > p.price && <div className="t-xs t-dim" style={{ textDecoration: 'line-through' }}>{formatCLP(p.listPrice)}</div>}
                      {(() => { const ppu = computePPU(p); return ppu ? <div className="t-xs t-mono t-dim" style={{ marginTop: 2 }}>{formatPPU(ppu)}</div> : null; })()}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); window.flyToCart && window.flyToCart(e); onAdd(p); }} className="btn btn-primary btn-sm"><Icon.Plus size={14}/> Agregar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {sorted.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <span className="t-sm t-muted">Mostrando 1–{sorted.length} de {cat.count.toLocaleString('es-CL')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="btn btn-secondary btn-sm"><Icon.ChevronLeft size={14}/></button>
                {[1,2,3,4,5].map(n => (
                  <button key={n} className={n === 1 ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} style={{ minWidth: 32 }}>{n}</button>
                ))}
                <span className="t-sm t-dim">…</span>
                <button className="btn btn-ghost btn-sm" style={{ minWidth: 32 }}>24</button>
                <button className="btn btn-secondary btn-sm"><Icon.ChevronRight size={14}/></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.CategoryPage = CategoryPage;
