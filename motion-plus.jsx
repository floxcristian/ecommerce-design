// ============================================================
// Motion Plus: category hover-peek, cursor spotlight grid,
// directional reveals, scramble price wrapper.
// ============================================================

const { useState, useEffect, useRef } = React;

// ============ Category Hover Preview Card ============
// Wraps a category tile and pops a panel showing top products on hover.
function CategoryPeek({ catId, anchor, getTopProducts, onNav }) {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!anchor) { setPos(null); return; }
    const r = anchor.getBoundingClientRect();
    setPos({ left: r.left + r.width / 2, top: r.bottom + 12 });
  }, [anchor]);
  if (!pos) return null;
  const products = getTopProducts(catId).slice(0, 3);
  if (products.length === 0) return null;
  const { ProductImg, formatCLP } = window.UI;
  return ReactDOM.createPortal(
    <div className="cat-peek" style={{
      position: 'fixed',
      left: Math.min(Math.max(pos.left - 180, 16), window.innerWidth - 360 - 16),
      top: pos.top,
    }}>
      <div className="t-eyebrow" style={{ color: 'var(--primary)', marginBottom: 10 }}>TOP EN ESTA CATEGORÍA</div>
      <div className="cat-peek-list">
        {products.map(p => (
          <button key={p.id} className="cat-peek-item" onClick={() => onNav('pdp', { productId: p.id })}>
            <div className="cat-peek-img"><ProductImg kind={p.image}/></div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div className="t-xs t-mono t-dim">{p.brand.toUpperCase()}</div>
              <div className="cat-peek-name">{p.name}</div>
              <div className="cat-peek-price">{formatCLP(p.price)}</div>
            </div>
            <Icon.ChevronRight size={14}/>
          </button>
        ))}
      </div>
      <button className="cat-peek-foot" onClick={() => onNav('category', { cat: catId })}>
        Ver toda la categoría <Icon.ChevronRight size={12}/>
      </button>
    </div>,
    document.body
  );
}

// Hook to wire peek into existing cat grid via DOM querying
// (non-invasive — listens for mouseenter on .cat-card)
function useCategoryPeek(onNav) {
  const [hovered, setHovered] = useState(null); // { el, catId }
  const hideTimerRef = useRef(null);
  useEffect(() => {
    const onEnter = (e) => {
      const card = e.target.closest('.cat-card[data-cat-id]');
      if (!card) return;
      clearTimeout(hideTimerRef.current);
      const catId = card.dataset.catId;
      setHovered({ el: card, catId });
    };
    const onLeave = (e) => {
      const card = e.target.closest('.cat-card[data-cat-id]');
      if (!card) return;
      // Allow mouse to enter the peek panel
      hideTimerRef.current = setTimeout(() => {
        const peek = document.querySelector('.cat-peek:hover');
        if (!peek) setHovered(null);
      }, 120);
    };
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    return () => {
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      clearTimeout(hideTimerRef.current);
    };
  }, []);
  if (!hovered) return null;
  const getTopProducts = (catId) => {
    const all = (window.MOCK?.PRODUCTS || []).filter(p => p.category === catId);
    return all.slice(0, 3);
  };
  return <CategoryPeek catId={hovered.catId} anchor={hovered.el} getTopProducts={getTopProducts} onNav={onNav}/>;
}

function CategoryPeekHost({ onNav }) {
  return useCategoryPeek(onNav);
}

// ============ Scrambling price (animates when value changes) ============
function ScramblePrice({ value, format = (v) => v.toLocaleString('es-CL'), prefix = '$', duration = 500, className }) {
  const ref = useRef(null);
  const lastRef = useRef(value);
  useEffect(() => {
    if (lastRef.current === value) return;
    lastRef.current = value;
    if (!ref.current) return;
    const finalText = prefix + format(value);
    if (window.scrambleTo) window.scrambleTo(ref.current, finalText, duration);
    else ref.current.textContent = finalText;
  }, [value, prefix, duration]);
  // Initial render
  return <span ref={ref} className={className}>{prefix}{format(value)}</span>;
}

Object.assign(window, {
  CategoryPeekHost,
  ScramblePrice,
});
